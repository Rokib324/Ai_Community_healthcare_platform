import json
from datetime import datetime, date
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from .models import patient, doctor, diseaseinfo, consultation, rating_review, HealthcareProvider, Appointment, EHRRecord, MedicineReminder, MedicineLog, HealthArticle
from chats.models import Chat, Feedback
import os
import joblib as jb
from django.conf import settings

# Load ML model
model_path = os.path.join(settings.BASE_DIR, 'trained_model')
model = jb.load(model_path)

# Disease and Symptoms Lists
diseaselist = [
    'Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction', 'Peptic ulcer diseae', 'AIDS', 'Diabetes ',
    'Gastroenteritis', 'Bronchial Asthma', 'Hypertension ', 'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)',
    'Jaundice', 'Malaria', 'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D',
    'Hepatitis E', 'Alcoholic hepatitis', 'Tuberculosis', 'Common Cold', 'Pneumonia', 'Dimorphic hemmorhoids(piles)',
    'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism', 'Hypoglycemia', 'Osteoarthristis',
    'Arthritis', '(vertigo) Paroymsal  Positional Vertigo', 'Acne', 'Urinary tract infection', 'Psoriasis', 'Impetigo'
]

symptomslist = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain',
    'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'spotting_ urination',
    'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy',
    'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating',
    'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes',
    'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
    'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
    'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
    'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
    'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
    'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
    'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
    'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
    'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
    'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
    'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine',
    'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
    'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
    'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum',
    'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
    'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
    'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum', 'prominent_veins_on_calf',
    'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling',
    'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose',
    'yellow_crust_ooze'
]

@ensure_csrf_cookie
@require_http_methods(["GET"])
def me(request):
    if request.user.is_authenticated:
        user = request.user
        user_data = {
            "authenticated": True,
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
            "is_patient": hasattr(user, 'patient'),
            "is_doctor": hasattr(user, 'doctor'),
        }
        if user_data["is_patient"]:
            user_data["name"] = user.patient.name
            user_data["dob"] = user.patient.dob.strftime('%Y-%m-%d') if user.patient.dob else ""
            user_data["gender"] = user.patient.gender
            user_data["address"] = user.patient.address
            user_data["mobile_no"] = user.patient.mobile_no
        elif user_data["is_doctor"]:
            user_data["name"] = user.doctor.name
            user_data["dob"] = user.doctor.dob.strftime('%Y-%m-%d') if user.doctor.dob else ""
            user_data["gender"] = user.doctor.gender
            user_data["address"] = user.doctor.address
            user_data["mobile_no"] = user.doctor.mobile_no
            user_data["registration_no"] = user.doctor.registration_no
            user_data["specialization"] = user.doctor.specialization
            user_data["qualification"] = user.doctor.qualification
            user_data["rating"] = user.doctor.rating
            user_data["State_Medical_Council"] = user.doctor.State_Medical_Council
        return JsonResponse(user_data)
    return JsonResponse({"authenticated": False})

@require_http_methods(["POST"])
def login_api(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON format"}, status=400)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        # Store usernames in session to preserve legacy backend view expectations
        if hasattr(user, 'patient'):
            request.session['patientusername'] = user.username
        elif hasattr(user, 'doctor'):
            request.session['doctorusername'] = user.username

        return JsonResponse({
            "success": True,
            "username": user.username,
            "is_superuser": user.is_superuser,
            "is_patient": hasattr(user, 'patient'),
            "is_doctor": hasattr(user, 'doctor'),
        })
    return JsonResponse({"success": False, "error": "Invalid username or password"}, status=400)

@require_http_methods(["POST"])
def logout_api(request):
    logout(request)
    request.session.pop('patientusername', None)
    request.session.pop('doctorusername', None)
    request.session.pop('patientid', None)
    request.session.pop('doctorid', None)
    request.session.pop('adminid', None)
    return JsonResponse({"success": True})

@require_http_methods(["POST"])
def signup_patient_api(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        name = data.get('name')
        dob_str = data.get('dob')
        gender = data.get('gender')
        address = data.get('address')
        mobile = data.get('mobile')
        password = data.get('password')
        password1 = data.get('password1')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON format"}, status=400)

    if not (username and email and name and dob_str and gender and address and mobile and password and password1):
        return JsonResponse({"success": False, "error": "Please fill out all required fields"}, status=400)

    if password != password1:
        return JsonResponse({"success": False, "error": "Passwords do not match"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"success": False, "error": "Username already taken"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"success": False, "error": "Email already taken"}, status=400)

    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({"success": False, "error": "Invalid date of birth format (must be YYYY-MM-DD)"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()

    patient_obj = patient(user=user, name=name, dob=dob, gender=gender, address=address, mobile_no=mobile)
    patient_obj.save()

    # Automatically log the user in after signup
    login(request, user)
    request.session['patientusername'] = user.username

    return JsonResponse({"success": True, "message": "Patient created successfully"})

@require_http_methods(["POST"])
def signup_doctor_api(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        name = data.get('name')
        dob_str = data.get('dob')
        gender = data.get('gender')
        address = data.get('address')
        mobile = data.get('mobile')
        registration_no = data.get('registration_no')
        year_of_registration_str = data.get('year_of_registration')
        qualification = data.get('qualification')
        State_Medical_Council = data.get('State_Medical_Council')
        specialization = data.get('specialization')
        password = data.get('password')
        password1 = data.get('password1')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON format"}, status=400)

    required_fields = [
        username, email, name, dob_str, gender, address, mobile,
        registration_no, year_of_registration_str, qualification,
        State_Medical_Council, specialization, password, password1
    ]
    if not all(required_fields):
        return JsonResponse({"success": False, "error": "Please fill out all required fields"}, status=400)

    if password != password1:
        return JsonResponse({"success": False, "error": "Passwords do not match"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"success": False, "error": "Username already taken"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"success": False, "error": "Email already taken"}, status=400)

    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        yor = datetime.strptime(year_of_registration_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({"success": False, "error": "Invalid date format"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()

    doctor_obj = doctor(
        user=user, name=name, dob=dob, gender=gender, address=address, mobile_no=mobile,
        registration_no=registration_no, year_of_registration=yor, qualification=qualification,
        State_Medical_Council=State_Medical_Council, specialization=specialization
    )
    doctor_obj.save()

    login(request, user)
    request.session['doctorusername'] = user.username

    return JsonResponse({"success": True, "message": "Doctor created successfully"})

@require_http_methods(["GET"])
def get_symptoms(request):
    return JsonResponse({"symptoms": sorted(symptomslist)})

@login_required
@require_http_methods(["POST"])
def predict_disease(request):
    try:
        data = json.loads(request.body)
        psymptoms = data.get("symptoms", [])
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

    if not psymptoms:
        return JsonResponse({"success": False, "error": "Please provide symptoms"}, status=400)

    # Initialize testing array with 0s
    testingsymptoms = [0] * len(symptomslist)

    # Mark 1 for matched symptoms
    for k in range(len(symptomslist)):
        if symptomslist[k] in psymptoms:
            testingsymptoms[k] = 1

    inputtest = [testingsymptoms]

    try:
        predicted = model.predict(inputtest)
        predicted_disease = predicted[0]

        y_pred_2 = model.predict_proba(inputtest)
        confidencescore = float(y_pred_2.max() * 100)
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Prediction failed: {str(e)}"}, status=500)

    # Doctor Specialization Mapping
    Rheumatologist = ['Osteoarthristis', 'Arthritis']
    Cardiologist = ['Heart attack', 'Bronchial Asthma', 'Hypertension ']
    ENT_specialist = ['(vertigo) Paroymsal  Positional Vertigo', 'Hypothyroidism']
    Orthopedist = []
    Neurologist = ['Varicose veins', 'Paralysis (brain hemorrhage)', 'Migraine', 'Cervical spondylosis']
    Allergist_Immunologist = ['Allergy', 'Pneumonia', 'AIDS', 'Common Cold', 'Tuberculosis', 'Malaria', 'Dengue', 'Typhoid']
    Urologist = ['Urinary tract infection', 'Dimorphic hemmorhoids(piles)']
    Dermatologist = ['Acne', 'Chicken pox', 'Fungal infection', 'Psoriasis', 'Impetigo']
    Gastroenterologist = [
        'Peptic ulcer diseae', 'GERD', 'Chronic cholestasis', 'Drug Reaction', 'Gastroenteritis', 'Hepatitis E',
        'Alcoholic hepatitis', 'Jaundice', 'hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Diabetes ', 'Hypoglycemia'
    ]

    consultdoctor = "other"
    if predicted_disease in Rheumatologist:
        consultdoctor = "Rheumatologist"
    elif predicted_disease in Cardiologist:
        consultdoctor = "Cardiologist"
    elif predicted_disease in ENT_specialist:
        consultdoctor = "ENT specialist"
    elif predicted_disease in Orthopedist:
        consultdoctor = "Orthopedist"
    elif predicted_disease in Neurologist:
        consultdoctor = "Neurologist"
    elif predicted_disease in Allergist_Immunologist:
        consultdoctor = "Allergist/Immunologist"
    elif predicted_disease in Urologist:
        consultdoctor = "Urologist"
    elif predicted_disease in Dermatologist:
        consultdoctor = "Dermatologist"
    elif predicted_disease in Gastroenterologist:
        consultdoctor = "Gastroenterologist"

    request.session['doctortype'] = consultdoctor

    # Save to database
    try:
        puser = request.user.patient
    except AttributeError:
        return JsonResponse({"success": False, "error": "Only patients can record predictions"}, status=403)

    diseaseinfo_new = diseaseinfo(
        patient=puser,
        diseasename=predicted_disease,
        no_of_symp=len(psymptoms),
        symptomsname=psymptoms,
        confidence=confidencescore,
        consultdoctor=consultdoctor
    )
    diseaseinfo_new.save()

    request.session['diseaseinfo_id'] = diseaseinfo_new.id

    return JsonResponse({
        "success": True,
        "predicteddisease": predicted_disease,
        "confidencescore": confidencescore,
        "consultdoctor": consultdoctor,
        "diseaseinfo_id": diseaseinfo_new.id
    })

@login_required
@require_http_methods(["GET"])
def list_doctors(request):
    specialization = request.GET.get('specialization')
    if specialization:
        doctors_qs = doctor.objects.filter(specialization=specialization)
    else:
        doctors_qs = doctor.objects.all()

    data = []
    for d in doctors_qs:
        data.append({
            "username": d.user.username,
            "name": d.name,
            "specialization": d.specialization,
            "qualification": d.qualification,
            "rating": d.rating,
            "mobile_no": d.mobile_no,
            "address": d.address,
            "gender": d.gender,
            "email": d.user.email
        })
    return JsonResponse({"doctors": data})

@login_required
@require_http_methods(["GET", "POST"])
def consultations_api(request):
    user = request.user
    if request.method == "GET":
        if hasattr(user, 'patient'):
            consultations_qs = consultation.objects.filter(patient=user.patient)
        elif hasattr(user, 'doctor'):
            consultations_qs = consultation.objects.filter(doctor=user.doctor)
        else:
            return JsonResponse({"success": False, "error": "Forbidden"}, status=403)

        data = []
        for c in consultations_qs:
            data.append({
                "id": c.id,
                "consultation_date": c.consultation_date.strftime('%Y-%m-%d'),
                "status": c.status,
                "diseasename": c.diseaseinfo.diseasename if c.diseaseinfo else "Unknown",
                "doctor_name": c.doctor.name if c.doctor else "Unknown",
                "patient_name": c.patient.name if c.patient else "Unknown"
            })
        return JsonResponse({"consultations": data})

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            doctor_username = data.get("doctor_username")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        if not hasattr(user, 'patient'):
            return JsonResponse({"success": False, "error": "Only patients can request consultation"}, status=403)

        try:
            duser = User.objects.get(username=doctor_username)
            doctor_obj = duser.doctor
        except (User.DoesNotExist, AttributeError):
            return JsonResponse({"success": False, "error": "Doctor not found"}, status=404)

        diseaseinfo_id = request.session.get('diseaseinfo_id')
        if not diseaseinfo_id:
            # Fallback to the latest patient disease prediction if session is empty
            latest_disease = diseaseinfo.objects.filter(patient=user.patient).order_back_by('id').first()
            if latest_disease:
                diseaseinfo_id = latest_disease.id
            else:
                return JsonResponse({"success": False, "error": "No disease prediction history found. Run prediction first."}, status=400)

        try:
            diseaseinfo_obj = diseaseinfo.objects.get(id=diseaseinfo_id)
        except diseaseinfo.DoesNotExist:
            return JsonResponse({"success": False, "error": "Disease record not found"}, status=404)

        consultation_new = consultation(
            patient=user.patient,
            doctor=doctor_obj,
            diseaseinfo=diseaseinfo_obj,
            consultation_date=date.today(),
            status="active"
        )
        consultation_new.save()

        # Update session
        request.session['consultation_id'] = consultation_new.id
        request.session['doctorusername'] = doctor_username

        return JsonResponse({
            "success": True,
            "consultation_id": consultation_new.id,
            "message": "Consultation created successfully"
        })

@login_required
@require_http_methods(["GET"])
def consultation_detail(request, pk):
    try:
        c = consultation.objects.get(id=pk)
    except consultation.DoesNotExist:
        return JsonResponse({"success": False, "error": "Consultation not found"}, status=404)

    # Auth check
    user = request.user
    if not (user.is_superuser or (hasattr(user, 'patient') and c.patient == user.patient) or (hasattr(user, 'doctor') and c.doctor == user.doctor)):
        return JsonResponse({"success": False, "error": "Unauthorized access"}, status=403)

    # Save to session to allow chat views to work seamlessly
    request.session['consultation_id'] = c.id

    data = {
        "id": c.id,
        "consultation_date": c.consultation_date.strftime('%Y-%m-%d'),
        "status": c.status,
        "diseaseinfo": {
            "diseasename": c.diseaseinfo.diseasename,
            "confidence": float(c.diseaseinfo.confidence),
            "symptoms": c.diseaseinfo.symptomsname
        } if c.diseaseinfo else None,
        "doctor": {
            "name": c.doctor.name,
            "username": c.doctor.user.username,
            "email": c.doctor.user.email,
            "mobile_no": c.doctor.mobile_no,
            "rating": c.doctor.rating
        } if c.doctor else None,
        "patient": {
            "name": c.patient.name,
            "username": c.patient.user.username,
            "email": c.patient.user.email,
            "mobile_no": c.patient.mobile_no,
            "age": c.patient.age
        } if c.patient else None,
    }
    return JsonResponse({"consultation": data})

@login_required
@require_http_methods(["POST"])
def close_consultation_api(request, pk):
    try:
        c = consultation.objects.get(id=pk)
    except consultation.DoesNotExist:
        return JsonResponse({"success": False, "error": "Consultation not found"}, status=404)

    c.status = "closed"
    c.save()
    return JsonResponse({"success": True, "message": "Consultation closed successfully"})

@login_required
@require_http_methods(["POST"])
def rate_review_api(request, pk):
    try:
        c = consultation.objects.get(id=pk)
    except consultation.DoesNotExist:
        return JsonResponse({"success": False, "error": "Consultation not found"}, status=404)

    try:
        data = json.loads(request.body)
        rating = int(data.get("rating", 0))
        review = data.get("review", "")
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"success": False, "error": "Invalid inputs"}, status=400)

    if not c.patient or c.patient.user != request.user:
        return JsonResponse({"success": False, "error": "Only the patient can review this consultation"}, status=403)

    rating_obj = rating_review(patient=c.patient, doctor=c.doctor, rating=rating, review=review)
    rating_obj.save()

    # Update doctor overall rating
    avg_rating = rating_obj.rating_is
    doctor.objects.filter(pk=c.doctor.user_id).update(rating=avg_rating)

    return JsonResponse({"success": True, "message": "Review submitted successfully"})

@login_required
@require_http_methods(["GET", "POST"])
def chat_messages_api(request, pk):
    try:
        c = consultation.objects.get(id=pk)
    except consultation.DoesNotExist:
        return JsonResponse({"success": False, "error": "Consultation not found"}, status=404)

    if request.method == "GET":
        chats = Chat.objects.filter(consultation_id=c).order_by('id')
        messages_list = []
        for chat in chats:
            messages_list.append({
                "sender": chat.sender.username,
                "message": chat.message,
                "time": chat.date.strftime('%H:%M:%S') if hasattr(chat, 'date') else ""
            })
        return JsonResponse({"messages": messages_list})

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            msg = data.get("message", "").strip()
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        if not msg:
            return JsonResponse({"success": False, "error": "Empty message"}, status=400)

        c_chat = Chat(consultation_id=c, sender=request.user, message=msg)
        c_chat.save()

        return JsonResponse({"success": True, "message": {
            "sender": request.user.username,
            "message": msg
        }})

@login_required
@require_http_methods(["GET", "POST"])
def feedbacks_api(request):
    if request.method == "GET":
        if not request.user.is_superuser:
            return JsonResponse({"success": False, "error": "Only admins can view feedbacks"}, status=403)
        feedbacks = Feedback.objects.all().order_by('-id')
        data = []
        for f in feedbacks:
            data.append({
                "id": f.id,
                "feedback": f.feedback,
                "sender": f.sender.username if f.sender else "Anonymous",
                "created": f.created.strftime('%Y-%m-%d %H:%M:%S') if f.created else ""
            })
        return JsonResponse({"feedbacks": data})

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            feedback_text = data.get("feedback", "").strip()
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        if not feedback_text:
            return JsonResponse({"success": False, "error": "Feedback text is empty"}, status=400)

        f = Feedback(sender=request.user, feedback=feedback_text)
        f.save()
        return JsonResponse({"success": True, "message": "Feedback submitted successfully"})

@login_required
@require_http_methods(["POST"])
def save_profile_patient(request, username):
    if request.user.username != username and not request.user.is_superuser:
        return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

    try:
        data = json.loads(request.body)
        name = data.get("name")
        dob_str = data.get("dob")
        gender = data.get("gender")
        address = data.get("address")
        mobile_no = data.get("mobile_no")
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

    try:
        puser = User.objects.get(username=username)
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
    except (User.DoesNotExist, ValueError):
        return JsonResponse({"success": False, "error": "Invalid user or date format"}, status=400)

    patient.objects.filter(pk=puser.patient).update(
        name=name, dob=dob, gender=gender, address=address, mobile_no=mobile_no
    )
    return JsonResponse({"success": True, "message": "Profile updated successfully"})

@login_required
@require_http_methods(["POST"])
def save_profile_doctor(request, username):
    if request.user.username != username and not request.user.is_superuser:
        return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

    try:
        data = json.loads(request.body)
        name = data.get("name")
        dob_str = data.get("dob")
        gender = data.get("gender")
        address = data.get("address")
        mobile_no = data.get("mobile_no")
        registration_no = data.get("registration_no")
        year_of_registration_str = data.get("year_of_registration")
        qualification = data.get("qualification")
        State_Medical_Council = data.get("State_Medical_Council")
        specialization = data.get("specialization")
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

    try:
        duser = User.objects.get(username=username)
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        yor = datetime.strptime(year_of_registration_str, '%Y-%m-%d').date()
    except (User.DoesNotExist, ValueError):
        return JsonResponse({"success": False, "error": "Invalid user or date format"}, status=400)

    doctor.objects.filter(pk=duser.doctor).update(
        name=name, dob=dob, gender=gender, address=address, mobile_no=mobile_no,
        registration_no=registration_no, year_of_registration=yor, qualification=qualification,
        State_Medical_Council=State_Medical_Council, specialization=specialization
    )
    return JsonResponse({"success": True, "message": "Profile updated successfully"})


# --- Healthcare Providers & Appointments ---

@require_http_methods(["GET"])
def list_providers(request):
    provider_type = request.GET.get('type')
    query = request.GET.get('q')
    
    providers = HealthcareProvider.objects.all()
    if provider_type:
        providers = providers.filter(provider_type=provider_type)
    if query:
        providers = providers.filter(name__icontains=query) | providers.filter(address__icontains=query)
        
    data = []
    for p in providers:
        data.append({
            "id": p.id,
            "name": p.name,
            "provider_type": p.provider_type,
            "address": p.address,
            "latitude": float(p.latitude) if p.latitude else None,
            "longitude": float(p.longitude) if p.longitude else None,
            "mobile_no": p.mobile_no,
            "services": p.services,
            "rating": float(p.rating)
        })
    return JsonResponse({"providers": data})


@login_required
@require_http_methods(["GET", "POST"])
def appointments_api(request):
    if request.method == "GET":
        user = request.user
        if hasattr(user, 'patient'):
            appointments = Appointment.objects.filter(patient=user.patient).order_by('-appointment_date', '-created_at')
        elif hasattr(user, 'doctor'):
            appointments = Appointment.objects.filter(doctor=user.doctor).order_by('-appointment_date', '-created_at')
        elif user.is_superuser:
            appointments = Appointment.objects.all().order_by('-appointment_date', '-created_at')
        else:
            return JsonResponse({"appointments": []})

        data = []
        for app in appointments:
            data.append({
                "id": app.id,
                "patient_name": app.patient.name,
                "provider_name": app.provider.name,
                "provider_address": app.provider.address,
                "provider_type": app.provider.provider_type,
                "doctor_name": app.doctor.name if app.doctor else None,
                "appointment_date": app.appointment_date.strftime('%Y-%m-%d'),
                "time_slot": app.time_slot,
                "status": app.status,
                "reasons": app.reasons
            })
        return JsonResponse({"appointments": data})

    elif request.method == "POST":
        if not hasattr(request.user, 'patient'):
            return JsonResponse({"success": False, "error": "Only patients can book appointments"}, status=403)
            
        try:
            body = json.loads(request.body)
            provider_id = body.get('provider_id')
            doctor_id = body.get('doctor_id')
            date_str = body.get('appointment_date')
            time_slot = body.get('time_slot')
            reasons = body.get('reasons', '')
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        if not provider_id or not date_str or not time_slot:
            return JsonResponse({"success": False, "error": "Missing required fields"}, status=400)

        try:
            provider = HealthcareProvider.objects.get(id=provider_id)
            app_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except HealthcareProvider.DoesNotExist:
            return JsonResponse({"success": False, "error": "Healthcare provider not found"}, status=404)
        except ValueError:
            return JsonResponse({"success": False, "error": "Invalid date format"}, status=400)

        doc = None
        if doctor_id:
            try:
                doc = doctor.objects.get(user_id=doctor_id)
            except doctor.DoesNotExist:
                pass

        appointment = Appointment.objects.create(
            patient=request.user.patient,
            provider=provider,
            doctor=doc,
            appointment_date=app_date,
            time_slot=time_slot,
            reasons=reasons,
            status='scheduled'
        )

        return JsonResponse({
            "success": True,
            "message": "Appointment booked successfully",
            "appointment_id": appointment.id
        })


@login_required
@require_http_methods(["POST"])
def cancel_appointment_api(request, pk):
    try:
        app = Appointment.objects.get(id=pk)
    except Appointment.DoesNotExist:
        return JsonResponse({"success": False, "error": "Appointment not found"}, status=404)

    # Authorization check: only the patient themselves or an admin can cancel
    if not request.user.is_superuser and (not hasattr(request.user, 'patient') or app.patient != request.user.patient):
        return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

    app.status = 'cancelled'
    app.save()
    return JsonResponse({"success": True, "message": "Appointment cancelled successfully"})


# --- Electronic Health Records (EHR) ---

@login_required
@require_http_methods(["GET", "POST"])
def ehr_records_api(request):
    if request.method == "GET":
        # Patients view their own, doctors can view a specific patient's if specified in query
        target_patient = None
        patient_username = request.GET.get('patient_username')
        
        if patient_username:
            if not hasattr(request.user, 'doctor') and not request.user.is_superuser:
                return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)
            try:
                target_patient = patient.objects.get(user__username=patient_username)
            except patient.DoesNotExist:
                return JsonResponse({"success": False, "error": "Patient not found"}, status=404)
        else:
            if hasattr(request.user, 'patient'):
                target_patient = request.user.patient
            else:
                return JsonResponse({"records": []})

        records = EHRRecord.objects.filter(patient=target_patient).order_by('-created_at', '-id')
        data = []
        for rec in records:
            data.append({
                "id": rec.id,
                "title": rec.title,
                "record_type": rec.record_type,
                "description": rec.description,
                "attachment_name": rec.attachment_name,
                "attachment_data": rec.attachment_data,
                "created_at": rec.created_at.strftime('%Y-%m-%d'),
                "doctor_name": rec.doctor.name if rec.doctor else None
            })
        return JsonResponse({"records": data})

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            title = body.get('title')
            record_type = body.get('record_type')
            description = body.get('description', '')
            attachment_name = body.get('attachment_name', '')
            attachment_data = body.get('attachment_data', '')
            patient_username = body.get('patient_username')  # optional, if uploaded by a doctor
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        if not title or not record_type:
            return JsonResponse({"success": False, "error": "Title and type are required"}, status=400)

        target_patient = None
        doc = None
        if hasattr(request.user, 'patient'):
            target_patient = request.user.patient
        elif hasattr(request.user, 'doctor'):
            doc = request.user.doctor
            if not patient_username:
                return JsonResponse({"success": False, "error": "Patient username is required for doctor uploads"}, status=400)
            try:
                target_patient = patient.objects.get(user__username=patient_username)
            except patient.DoesNotExist:
                return JsonResponse({"success": False, "error": "Patient not found"}, status=404)
        else:
            return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

        record = EHRRecord.objects.create(
            patient=target_patient,
            doctor=doc,
            title=title,
            record_type=record_type,
            description=description,
            attachment_name=attachment_name,
            attachment_data=attachment_data
        )

        return JsonResponse({
            "success": True,
            "message": "Health record stored successfully",
            "record_id": record.id
        })


@login_required
@require_http_methods(["DELETE"])
def delete_ehr_record_api(request, pk):
    try:
        record = EHRRecord.objects.get(id=pk)
    except EHRRecord.DoesNotExist:
        return JsonResponse({"success": False, "error": "Record not found"}, status=404)

    # Check ownership
    if not request.user.is_superuser and (not hasattr(request.user, 'patient') or record.patient != request.user.patient):
        return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

    record.delete()
    return JsonResponse({"success": True, "message": "Record deleted successfully"})


# --- Medicine Reminders & Logs ---

@login_required
@require_http_methods(["GET", "POST"])
def reminders_api(request):
    if not hasattr(request.user, 'patient'):
        return JsonResponse({"reminders": []})

    if request.method == "GET":
        reminders = MedicineReminder.objects.filter(patient=request.user.patient).order_by('-created_at')
        target_date_str = request.GET.get('date') # Format: YYYY-MM-DD
        
        target_date = None
        if target_date_str:
            try:
                target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()
            except ValueError:
                pass

        data = []
        for rem in reminders:
            logs = []
            if target_date:
                # Find if logged for this date
                day_logs = MedicineLog.objects.filter(reminder=rem, taken_date=target_date)
                for l in day_logs:
                    logs.append({
                        "taken_time": l.taken_time,
                        "status": l.status
                    })
            data.append({
                "id": rem.id,
                "medicine_name": rem.medicine_name,
                "dosage": rem.dosage,
                "frequency": rem.frequency,
                "times": rem.times,
                "start_date": rem.start_date.strftime('%Y-%m-%d'),
                "end_date": rem.end_date.strftime('%Y-%m-%d'),
                "active": rem.active,
                "logs": logs
            })
        return JsonResponse({"reminders": data})

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            medicine_name = body.get('medicine_name')
            dosage = body.get('dosage')
            frequency = body.get('frequency', 'Daily')
            times = body.get('times', [])
            start_date_str = body.get('start_date')
            end_date_str = body.get('end_date')
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

        if not medicine_name or not dosage or not start_date_str or not end_date_str:
            return JsonResponse({"success": False, "error": "Missing required fields"}, status=400)

        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({"success": False, "error": "Invalid date format"}, status=400)

        reminder = MedicineReminder.objects.create(
            patient=request.user.patient,
            medicine_name=medicine_name,
            dosage=dosage,
            frequency=frequency,
            times=times,
            start_date=start_date,
            end_date=end_date,
            active=True
        )

        return JsonResponse({
            "success": True,
            "message": "Medicine reminder added successfully",
            "reminder_id": reminder.id
        })


@login_required
@require_http_methods(["DELETE", "PATCH"])
def reminder_detail_api(request, pk):
    try:
        rem = MedicineReminder.objects.get(id=pk)
    except MedicineReminder.DoesNotExist:
        return JsonResponse({"success": False, "error": "Reminder not found"}, status=404)

    if not request.user.is_superuser and (not hasattr(request.user, 'patient') or rem.patient != request.user.patient):
        return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

    if request.method == "DELETE":
        rem.delete()
        return JsonResponse({"success": True, "message": "Reminder deleted successfully"})

    elif request.method == "PATCH":
        try:
            body = json.loads(request.body)
            if 'active' in body:
                rem.active = bool(body['active'])
                rem.save()
            return JsonResponse({"success": True, "active": rem.active})
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)


@login_required
@require_http_methods(["POST"])
def log_reminder_taken_api(request, pk):
    try:
        rem = MedicineReminder.objects.get(id=pk)
    except MedicineReminder.DoesNotExist:
        return JsonResponse({"success": False, "error": "Reminder not found"}, status=404)

    if not hasattr(request.user, 'patient') or rem.patient != request.user.patient:
        return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

    try:
        body = json.loads(request.body)
        date_str = body.get('date')
        time_slot = body.get('time_slot')
        status = body.get('status', 'taken')  # 'taken' or 'skipped'
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

    if not date_str or not time_slot:
        return JsonResponse({"success": False, "error": "Date and time slot are required"}, status=400)

    try:
        log_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({"success": False, "error": "Invalid date format"}, status=400)

    # Get or create log
    log, created = MedicineLog.objects.get_or_create(
        reminder=rem,
        taken_date=log_date,
        taken_time=time_slot,
        defaults={"status": status}
    )
    if not created:
        log.status = status
        log.save()

    return JsonResponse({"success": True, "status": log.status})


# --- Centralized Health Library ---

@require_http_methods(["GET"])
def list_articles(request):
    category = request.GET.get('category')
    query = request.GET.get('q')

    articles = HealthArticle.objects.all().order_by('-created_at')
    if category:
        articles = articles.filter(category=category)
    if query:
        articles = articles.filter(title__icontains=query) | articles.filter(summary__icontains=query) | articles.filter(content__icontains=query)

    data = []
    for art in articles:
        data.append({
            "id": art.id,
            "title": art.title,
            "category": art.category,
            "summary": art.summary,
            "author": art.author,
            "read_time": art.read_time,
            "created_at": art.created_at.strftime('%Y-%m-%d')
        })
    return JsonResponse({"articles": data})


@require_http_methods(["GET"])
def article_detail(request, pk):
    try:
        art = HealthArticle.objects.get(id=pk)
    except HealthArticle.DoesNotExist:
        return JsonResponse({"success": False, "error": "Article not found"}, status=404)

    return JsonResponse({
        "article": {
            "id": art.id,
            "title": art.title,
            "category": art.category,
            "summary": art.summary,
            "content": art.content,
            "author": art.author,
            "read_time": art.read_time,
            "created_at": art.created_at.strftime('%Y-%m-%d')
        }
    })


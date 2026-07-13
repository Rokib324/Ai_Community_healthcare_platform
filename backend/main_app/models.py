# pyrefly: ignore [missing-import]
from django.db import models
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User

from datetime import date

# Create your models here.


#user = models.OneToOneField(settings.AUTH_USER_MODEL)

class patient(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    is_patient = models.BooleanField(default=True)
    is_doctor = models.BooleanField(default=False)

    name = models.CharField(max_length = 50)
    dob = models.DateField()
    address = models.CharField(max_length = 100)
    mobile_no = models.CharField(max_length = 15)
    gender = models.CharField(max_length = 10)

    
    @property
    def age(self):
        today = date.today()
        db = self.dob
        age = today.year - db.year
        if today.month < db.month or today.month == db.month and today.day < db.day:
            age -= 1
        return age 



class doctor(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    is_patient = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=True)

    name = models.CharField(max_length = 50)
    dob = models.DateField()
    address = models.CharField(max_length = 100)
    mobile_no = models.CharField(max_length = 15)
    gender = models.CharField(max_length = 10)

    registration_no = models.CharField(max_length = 20)
    year_of_registration = models.DateField()
    qualification = models.CharField(max_length = 20)
    State_Medical_Council = models.CharField(max_length = 30)

    specialization = models.CharField(max_length = 30)

    rating = models.IntegerField(default=0)





class diseaseinfo(models.Model):

    patient = models.ForeignKey(patient , null=True, on_delete=models.SET_NULL)

    diseasename = models.CharField(max_length = 200)
    no_of_symp = models.IntegerField()
    symptomsname = models.JSONField(default=list)
    confidence = models.DecimalField(max_digits=5, decimal_places=2)
    consultdoctor = models.CharField(max_length = 200)



class consultation(models.Model):

    patient = models.ForeignKey(patient ,null=True, on_delete=models.SET_NULL)
    doctor = models.ForeignKey(doctor ,null=True, on_delete=models.SET_NULL)
    diseaseinfo = models.OneToOneField(diseaseinfo, null=True, on_delete=models.SET_NULL)
    consultation_date = models.DateField()
    status = models.CharField(max_length = 20)

def __str__(self):
        return f"{self.doctor} ({self.patient})"



class rating_review(models.Model):

    patient = models.ForeignKey(patient ,null=True, on_delete=models.SET_NULL)
    doctor = models.ForeignKey(doctor ,null=True, on_delete=models.SET_NULL)
    
    rating = models.IntegerField(default=0)
    review = models.TextField( blank=True ) 


    @property
    def rating_is(self):
        new_rating = 0
        rating_obj = rating_review.objects.filter(doctor=self.doctor)
        for i in rating_obj:
            new_rating += i.rating
       
        new_rating = new_rating/len(rating_obj)
        new_rating = int(new_rating)
        
        return new_rating


class HealthcareProvider(models.Model):
    PROVIDER_TYPES = [
        ('hospital', 'Hospital'),
        ('clinic', 'Clinic'),
        ('pharmacy', 'Pharmacy'),
        ('diagnostic', 'Diagnostic Center'),
    ]
    name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPES)
    address = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    mobile_no = models.CharField(max_length=15)
    services = models.JSONField(default=list)  # e.g., ["Emergency", "Pediatrics", "Cardiology", "Diagnostics"]
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)

    def __str__(self):
        return f"{self.name} ({self.provider_type})"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    patient = models.ForeignKey(patient, on_delete=models.CASCADE, related_name='appointments')
    provider = models.ForeignKey(HealthcareProvider, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    appointment_date = models.DateField()
    time_slot = models.CharField(max_length=15)  # e.g. "10:00 AM"
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    reasons = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.name} - {self.provider.name} on {self.appointment_date}"


class EHRRecord(models.Model):
    RECORD_TYPES = [
        ('prescription', 'Prescription'),
        ('lab_report', 'Lab Report'),
        ('scan', 'Imaging / Scan'),
        ('vaccine', 'Vaccination Record'),
        ('general', 'General Medical Note'),
    ]
    patient = models.ForeignKey(patient, on_delete=models.CASCADE, related_name='records')
    doctor = models.ForeignKey(doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='written_records')
    title = models.CharField(max_length=100)
    record_type = models.CharField(max_length=25, choices=RECORD_TYPES)
    description = models.TextField(blank=True)
    attachment_name = models.CharField(max_length=100, blank=True)
    attachment_data = models.TextField(blank=True)  # Store mock base64 or description contents
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.patient.name}"


class MedicineReminder(models.Model):
    patient = models.ForeignKey(patient, on_delete=models.CASCADE, related_name='reminders')
    medicine_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)  # e.g. "1 Tablet", "2 Drops", "5 ml"
    frequency = models.CharField(max_length=50)  # e.g. "Daily", "Weekly", "As needed"
    times = models.JSONField(default=list)  # e.g. ["08:00", "14:00", "20:00"]
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.medicine_name} - {self.patient.name}"


class MedicineLog(models.Model):
    reminder = models.ForeignKey(MedicineReminder, on_delete=models.CASCADE, related_name='logs')
    taken_date = models.DateField()
    taken_time = models.CharField(max_length=10)  # e.g. "08:00"
    status = models.CharField(max_length=10, default='taken')  # 'taken', 'skipped'

    def __str__(self):
        return f"{self.reminder.medicine_name} taken on {self.taken_date} {self.taken_time}"


class HealthArticle(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50)  # e.g. "Nutrition", "Mental Health", "Disease Guides", "Preventive Care"
    summary = models.TextField()
    content = models.TextField()
    author = models.CharField(max_length=100, default="HealthBridge Medical Editorial")
    read_time = models.IntegerField(default=5)  # in minutes
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
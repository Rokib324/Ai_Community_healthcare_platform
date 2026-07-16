import os
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
# pyrefly: ignore [missing-import]
from django.shortcuts import render 
# pyrefly: ignore [missing-import]
from django.http import JsonResponse
# pyrefly: ignore [missing-import]
from django.views.decorators.csrf import csrf_exempt
# pyrefly: ignore [missing-import]
from django.views.decorators.http import require_http_methods

try:
    from .Utils.Agent import Cardiologist, Psychologist, Pulmonologist, MultidisciplinaryTeam
except ImportError:
    from Utils.Agent import Cardiologist, Psychologist, Pulmonologist, MultidisciplinaryTeam

UPLOAD_FOLDER = 'uploads'
RESULT_PATH = 'results/final_diagnosis.txt'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(RESULT_PATH), exist_ok=True)


@csrf_exempt
def index(request):
    if request.method == 'POST':
        file = request.FILES.get('report')
        if file and file.name.endswith('.txt'):
            filepath = os.path.join(UPLOAD_FOLDER, file.name)
            
            with open(filepath, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            with open(filepath, 'r', encoding='utf-8') as f:
                medical_report = f.read()

            # Run individual specialists
            agents = {
                "Cardiologist": Cardiologist(medical_report),
                "Psychologist": Psychologist(medical_report),
                "Pulmonologist": Pulmonologist(medical_report)
            }

            responses = {}
            with ThreadPoolExecutor() as executor:
                futures = {executor.submit(agent.run): name for name, agent in agents.items()}
                for future in as_completed(futures):
                    agent_name = futures[future]
                    responses[agent_name] = future.result()

            # Run multidisciplinary agent
            team_agent = MultidisciplinaryTeam(
                cardiologist_report=responses["Cardiologist"],
                psychologist_report=responses["Psychologist"],
                pulmonologist_report=responses["Pulmonologist"]
            )
            final_diagnosis = team_agent.run()

            # Save the diagnosis
            final_diagnosis_text = "### Final Diagnosis:\n\n" + final_diagnosis
            with open(RESULT_PATH, 'w', encoding='utf-8') as result_file:
                result_file.write(final_diagnosis_text)

            return render(request, "index.html", {"diagnosis": final_diagnosis_text})

        return render(request, "index.html", {"error": "Please upload a valid .txt file."})

    return render(request, "index.html")


@csrf_exempt
@require_http_methods(["POST"])
def analyze_report_api(request):
    medical_report = ""
    
    # Check if a file is uploaded
    if request.FILES.get('report'):
        uploaded_file = request.FILES['report']
        if not uploaded_file.name.endswith('.txt'):
            return JsonResponse({"success": False, "error": "Only .txt files are supported"}, status=400)
        try:
            medical_report = uploaded_file.read().decode('utf-8', errors='ignore')
        except Exception as e:
            return JsonResponse({"success": False, "error": f"Failed to read file: {str(e)}"}, status=400)
    else:
        # Check for JSON request body or fallback to POST form parameters
        try:
            body = json.loads(request.body) if request.body else {}
            medical_report = body.get('report_text', '')
        except json.JSONDecodeError:
            medical_report = request.POST.get('report_text', '')

    if not medical_report or not medical_report.strip():
        return JsonResponse({"success": False, "error": "No medical report text provided"}, status=400)

    # Run individual specialists
    agents = {
        "Cardiologist": Cardiologist(medical_report),
        "Psychologist": Psychologist(medical_report),
        "Pulmonologist": Pulmonologist(medical_report)
    }

    responses = {}
    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(agent.run): name for name, agent in agents.items()}
        for future in as_completed(futures):
            agent_name = futures[future]
            responses[agent_name] = future.result()

    # Run multidisciplinary agent
    team_agent = MultidisciplinaryTeam(
        cardiologist_report=responses.get("Cardiologist", ""),
        psychologist_report=responses.get("Psychologist", ""),
        pulmonologist_report=responses.get("Pulmonologist", "")
    )
    final_diagnosis = team_agent.run()

    return JsonResponse({
        "success": True,
        "cardiologist_report": responses.get("Cardiologist"),
        "psychologist_report": responses.get("Psychologist"),
        "pulmonologist_report": responses.get("Pulmonologist"),
        "final_diagnosis": final_diagnosis
    })

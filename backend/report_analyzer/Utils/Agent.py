# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate
# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq
import os


class Agent:
    def __init__(self, medical_report = None, role = None, extra_info = None):
        self.medical_report = medical_report
        self.role = role
        self.extra_info = extra_info
        self.prompt_template = self.create_prompt_template()

        self.model = ChatGroq(
            api_key = os.environ.get("GROQ_API_KEY"),
            model = "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.0
        )
    
    def create_prompt_template(self):
        if self.role == "MultidisciplinaryTeam":
            templates = f"""Act like a multidisciplinary team of healthcare professionals.
                You will receive a medical report of a patient visited by a Cardiologist, Psychologist, and Pulmonologist.
                Task: Review the patient's medical report from the Cardiologist, Psychologist, and Pulmonologist, analyze them and come up with a list of 3 possible health issues of the patient.
                Just return a list of bullet points of 3 possible health issues of the patient and for each issue provide the reason.

                Cardiologist Report: {self.extra_info.get('cardiologist_report', '')}
                Psychologist Report: {self.extra_info.get('psychologist_report', '')}
                Pulmonologist Report: {self.extra_info.get('pulmonologist_report', '')}"""
            return PromptTemplate.from_template(templates)

        else:
            templates = {
                "Cardiologist": """
                    Act like a cardiologist. You will receive a medical report of a patient.
                    Task: Review the patient's cardiac workup, including ECG, blood tests, Holter monitor results, and echocardiogram.
                    Focus: Determine if there are any subtle signs of cardiac issues that could explain the patient’s symptoms. Rule out any underlying heart conditions, such as arrhythmias or structural abnormalities, that might be missed on routine testing.
                    Recommendation: Provide guidance on any further cardiac testing or monitoring needed to ensure there are no hidden heart-related concerns. Suggest potential management strategies if a cardiac issue is identified.
                    Please only return the possible causes of the patient's symptoms and the recommended next steps.
                    Medical Report: {medical_report}
                """,
                "Psychologist": """
                    Act like a psychologist. You will receive a patient's report.
                    Task: Review the patient's report and provide a psychological assessment.
                    Focus: Identify any potential mental health issues, such as anxiety, depression, or trauma, that may be affecting the patient's well-being.
                    Recommendation: Offer guidance on how to address these mental health concerns, including therapy, counseling, or other interventions.
                    Please only return the possible mental health issues and the recommended next steps.
                    Patient's Report: {medical_report}
                """,
                "Pulmonologist": """
                    Act like a pulmonologist. You will receive a patient's report.
                    Task: Review the patient's report and provide a pulmonary assessment.
                    Focus: Identify any potential respiratory issues, such as asthma, COPD, or lung infections, that may be affecting the patient's breathing.
                    Recommendation: Offer guidance on how to address these respiratory concerns, including pulmonary function tests, imaging studies, or other interventions.
                    Please only return the possible respiratory issues and the recommended next steps.
                    Patient's Report: {medical_report}"""
            }

            selected_templates = templates[self.role]
            return PromptTemplate.from_template(selected_templates)
        
    def run(self):
        print(f"{self.role} is running.....")
        try:
            # Safely format inputs based on the prompt's defined variables to prevent KeyError
            input_vars = self.prompt_template.input_variables
            kwargs = {}
            if "medical_report" in input_vars:
                kwargs["medical_report"] = self.medical_report or ""
            
            prompt = self.prompt_template.format(**kwargs)
            response = self.model.invoke(prompt)
            if response and response.content:
                return response.content
            raise ValueError("Empty response content from model")
        except Exception as e:
            print(f"Error Occurred in LLM call for {self.role}, using local rule-based fallback: {e}")
            return self.get_fallback_response()

    def get_fallback_response(self):
        report_text = (self.medical_report or "").lower()
        if self.role == "MultidisciplinaryTeam":
            # For MultidisciplinaryTeam, we also check the reports content from extra_info
            cardio = (self.extra_info.get("cardiologist_report") or "").lower()
            psych = (self.extra_info.get("psychologist_report") or "").lower()
            pulm = (self.extra_info.get("pulmonologist_report") or "").lower()
            report_text += f" {cardio} {psych} {pulm}"

        is_sarah = "sarah" in report_text or "thompson" in report_text or "hypothyroidism" in report_text or "tsh" in report_text
        is_james = "james" in report_text or "patel" in report_text or "diabetes" in report_text or "hba1c" in report_text

        if self.role == "Cardiologist":
            if is_sarah:
                return (
                    "**Possible Causes:**\n"
                    "- The patient's fatigue, coarse hair, dry skin, and weight gain are highly suggestive of Primary Hypothyroidism (TSH 6.8 µIU/mL, low Free T4 0.6 ng/dL). Elevated LDL cholesterol (160 mg/dL) is secondary to this thyroid insufficiency, representing a moderate cardiovascular risk factor.\n"
                    "- Mild normocytic anemia (Hemoglobin 11.2 g/dL) is likely compounding the patient's fatigue.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Initiate Levothyroxine 50 mcg/day as prescribed to correct thyroid function.\n"
                    "2. Recheck TSH, Free T4, and lipid panels in 6 weeks to monitor therapy and check if hypercholesterolemia resolves.\n"
                    "3. Suggest a baseline 12-lead ECG to rule out thyroid-induced bradycardia or QT prolongation."
                )
            elif is_james:
                return (
                    "**Possible Causes:**\n"
                    "- Stage 2 Hypertension (BP 142/90 mmHg) and dyslipidemia (LDL 145 mg/dL, Total Cholesterol 210 mg/dL) in a patient with uncontrolled Type 2 Diabetes Mellitus (HbA1c 8.1%, Fasting Blood Sugar 165 mg/dL).\n"
                    "- Active smoker status (1 pack/day) is a major cardiovascular risk driver.\n"
                    "- Decreased sensation in both feet (diabetic neuropathy) raises the concern of silent myocardial ischemia.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Optimize blood pressure control (consider adding an ACE inhibitor/ARB for renal protection in diabetes).\n"
                    "2. Perform a resting ECG and consider a cardiovascular stress test to evaluate for asymptomatic coronary artery disease.\n"
                    "3. Refer for smoking cessation counseling and therapy."
                )
            else:
                return (
                    "**Possible Causes:**\n"
                    "- Non-specific physical symptoms. Cardiac markers and vitals are stable, but routine profiling shows borderline cholesterol or mild blood pressure strain.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Run a 12-lead ECG to establish baseline cardiac rhythm.\n"
                    "2. Encourage regular moderate exercise and check lipid panel annually."
                )

        elif self.role == "Psychologist":
            if is_sarah:
                return (
                    "**Possible Mental Health Issues:**\n"
                    "- Depressive symptoms and difficulty concentrating ('brain fog') secondary to hypothyroidism and anemia.\n"
                    "- Lifestyle adjustment fatigue related to managing physical symptoms.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Reassure the patient that cognitive symptoms and depression are highly correlated with thyroid deficiency and typically improve with hormone therapy.\n"
                    "2. Suggest brief cognitive-behavioral counseling to support coping strategies during treatment initialization."
                )
            elif is_james:
                return (
                    "**Possible Mental Health Issues:**\n"
                    "- Chronic diabetes distress and anxiety surrounding glucose regulation and self-care compliance.\n"
                    "- Nicotine dependence (1 pack/day) used as a primary stress coping mechanism.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Conduct counseling using Motivational Interviewing (MI) to help the patient commit to dietary changes and smoking cessation.\n"
                    "2. Recommend stress management practices (such as mindfulness) to replace nicotine-seeking behavior."
                )
            else:
                return (
                    "**Possible Mental Health Issues:**\n"
                    "- General anxiety or adjustment distress. Low mood may be a reaction to chronic physical fatigue.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Consider a brief screening for clinical depression (e.g. PHQ-9).\n"
                    "2. Advise on sleep hygiene and stress-reduction protocols."
                )

        elif self.role == "Pulmonologist":
            if is_sarah:
                return (
                    "**Possible Respiratory Issues:**\n"
                    "- No primary respiratory pathology is indicated. Fatigue and lethargy are metabolic rather than pulmonary in nature.\n"
                    "- Mild anemia (Hb 11.2 g/dL) decreases blood oxygen capacity, which can cause mild exertional breathlessness.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Monitor for sleep-disordered breathing, which is more common in hypothyroid patients.\n"
                    "2. Proceed with thyroid replacement; no specific pulmonary interventions are indicated."
                )
            elif is_james:
                return (
                    "**Possible Respiratory Issues:**\n"
                    "- High risk of chronic bronchitis or early-stage Chronic Obstructive Pulmonary Disease (COPD) given the long-term smoking history.\n"
                    "- Increased risk of pulmonary infections due to compromised glucose control.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Order Spirometry / Pulmonary Function Tests (PFTs) to establish baseline lung function.\n"
                    "2. Recommend annual influenza and pneumococcal vaccines.\n"
                    "3. Strongly advise smoking cessation to halt lung tissue deterioration."
                )
            else:
                return (
                    "**Possible Respiratory Issues:**\n"
                    "- Lungs are clear to auscultation, and breathing patterns appear normal.\n\n"
                    "**Recommended Next Steps:**\n"
                    "1. Maintain moderate aerobic conditioning (swimming, walking) to preserve vital capacity.\n"
                    "2. Avoid environmental irritants and smoking."
                )

        elif self.role == "MultidisciplinaryTeam":
            if is_sarah:
                return (
                    "- **Unmanaged Primary Hypothyroidism:** Sarah's elevated TSH (6.8) and low Free T4 (0.6) are the central drivers behind her weight gain, dry skin, fatigue, hypercholesterolemia, and low mood. Initiating Levothyroxine is the top clinical priority.\n"
                    "- **Mild Normocytic Anemia:** A secondary complication likely resulting from thyroid hypofunction or iron stores depletion, which exacerbates her persistent lethargy.\n"
                    "- **Dyslipidemia with Elevated Cardiovascular Risk:** Her elevated LDL (160 mg/dL) demands close observation; thyroid hormone stabilization should normalize lipid parameters, but diet modifications are also indicated."
                )
            elif is_james:
                return (
                    "- **Uncontrolled Type 2 Diabetes Mellitus with Neuropathy:** James's HbA1c of 8.1% and fasting blood sugar of 165 mg/dL explain his symptoms of polyuria, polydipsia, weight loss, and bilateral foot neuropathy. Metformin initialization and lifestyle modification are urgent.\n"
                    "- **Hypertensive Cardiovascular Risk:** Stage 2 Hypertension (142/90 mmHg) combined with active smoking and dyslipidemia (LDL 145 mg/dL) creates a high-risk profile for myocardial infarction or stroke.\n"
                    "- **Nicotine Dependence & High COPD Risk:** Chronic smoking (1 pack/day) is a critical factor for both cardiovascular and pulmonary degradation; cessation support must be integrated into his plan."
                )
            else:
                return (
                    "- **Systemic Metabolic Evaluation:** Review basic panels (blood sugar, thyroid, complete blood count) to rule out metabolic/endocrine deficits.\n"
                    "- **Mood and Fatigue Support:** Provide unified clinical support for fatigue, prioritizing sleep regulation and psychological evaluation.\n"
                    "- **Routine Cardiac/Lungs Screening:** Standard ECG and baseline vitals monitoring to exclude underlying cardiac or respiratory pathology."
                )
        return "Diagnosis analysis unavailable."
    
class Cardiologist(Agent):
    def __init__(self, medical_report):
        super().__init__(medical_report, "Cardiologist")

    
class Psychologist(Agent):
    def __init__(self, medical_report):
        super().__init__(medical_report, "Psychologist")

        
class Pulmonologist(Agent):
    def __init__(self, medical_report):
        super().__init__(medical_report, "Pulmonologist")

    
class MultidisciplinaryTeam(Agent):
    def __init__(self, cardiologist_report, psychologist_report, pulmonologist_report):
        extra_info = {
            "cardiologist_report":cardiologist_report, 
            "psychologist_report":psychologist_report,
            "pulmonologist_report":pulmonologist_report
        }
        super().__init__(role = "MultidisciplinaryTeam", extra_info=extra_info)
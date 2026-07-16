# pyrefly: ignore [missing-import]
from django.urls import path
from . import api
from report_analyzer import views as report_views

urlpatterns = [
    # Report Analyzer
    path('report-analyzer/analyze/', report_views.analyze_report_api, name='api_analyze_report'),

    # Auth endpoints
    path('auth/me/', api.me, name='api_me'),
    path('auth/login/', api.login_api, name='api_login'),
    path('auth/logout/', api.logout_api, name='api_logout'),
    path('auth/signup/patient/', api.signup_patient_api, name='api_signup_patient'),
    path('auth/signup/doctor/', api.signup_doctor_api, name='api_signup_doctor'),
    
    # Disease checker endpoints
    path('symptoms/', api.get_symptoms, name='api_symptoms'),
    path('predict/', api.predict_disease, name='api_predict'),
    
    # Doctor endpoints
    path('doctors/', api.list_doctors, name='api_list_doctors'),
    
    # Consultation endpoints
    path('consultations/', api.consultations_api, name='api_consultations'),
    path('consultations/<int:pk>/', api.consultation_detail, name='api_consultation_detail'),
    path('consultations/<int:pk>/close/', api.close_consultation_api, name='api_close_consultation'),
    path('consultations/<int:pk>/review/', api.rate_review_api, name='api_rate_review'),
    path('consultations/<int:pk>/messages/', api.chat_messages_api, name='api_chat_messages'),
    
    # Feedbacks endpoints
    path('feedbacks/', api.feedbacks_api, name='api_feedbacks'),
    
    # Profiles endpoints
    path('profiles/patient/<str:username>/', api.save_profile_patient, name='api_save_profile_patient'),
    path('profiles/doctor/<str:username>/', api.save_profile_doctor, name='api_save_profile_doctor'),

    # Healthcare Providers & Appointments
    path('providers/', api.list_providers, name='api_list_providers'),
    path('appointments/', api.appointments_api, name='api_appointments'),
    path('appointments/<int:pk>/cancel/', api.cancel_appointment_api, name='api_cancel_appointment'),

    # Electronic Health Records (EHR)
    path('ehr/', api.ehr_records_api, name='api_ehr_records'),
    path('ehr/<int:pk>/', api.delete_ehr_record_api, name='api_delete_ehr_record'),

    # Medicine Reminders
    path('reminders/', api.reminders_api, name='api_reminders'),
    path('reminders/<int:pk>/', api.reminder_detail_api, name='api_reminder_detail'),
    path('reminders/<int:pk>/log/', api.log_reminder_taken_api, name='api_log_reminder_taken'),

    # Health Library Articles
    path('articles/', api.list_articles, name='api_articles'),
    path('articles/<int:pk>/', api.article_detail, name='api_article_detail'),
]

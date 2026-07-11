from django.urls import path
from . import api

urlpatterns = [
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
]

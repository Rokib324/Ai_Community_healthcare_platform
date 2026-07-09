# pyrefly: ignore [missing-import]
from django.urls import path
from .views import home

urlpatterns = [
    path("", home),
]
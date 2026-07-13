# pyrefly: ignore [missing-import]
from django.contrib import admin
from .models import patient , doctor , diseaseinfo , consultation,rating_review,HealthArticle, MedicineLog, MedicineReminder, EHRRecord, HealthcareProvider, Appointment

# Register your models here.

admin.site.register(patient)
admin.site.register(doctor)
admin.site.register(diseaseinfo)
admin.site.register(consultation)
admin.site.register(rating_review)
admin.site.register(MedicineLog)
admin.site.register(MedicineReminder)
admin.site.register(EHRRecord)
admin.site.register(HealthArticle)
admin.site.register(HealthcareProvider)
admin.site.register(Appointment)

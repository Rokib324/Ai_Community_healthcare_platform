# pyrefly: ignore [missing-import]
from rest_framework.response import Response    
# pyrefly: ignore [missing-import]
from rest_framework.decorators import api_view

@api_view(["GET"])
def home(request):
    return Response({
        "message": "Hello from Django!"
    })
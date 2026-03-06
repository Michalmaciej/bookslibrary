from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import BookViewSet, register

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = router.urls + [
    path('auth/register/', register, name='register'),
]

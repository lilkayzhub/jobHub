from django.urls import path
from .views import (
    CustomTokenObtainPairView, RegisterView,
    MeView, SeekerProfileView, EmployerProfileView,
    ForgotPasswordView, ResetPasswordView,
)

urlpatterns = [
    path('register/',         RegisterView.as_view(),               name='register'),
    path('login/',            CustomTokenObtainPairView.as_view(),   name='login'),
    path('me/',               MeView.as_view(),                      name='me'),
    path('seeker-profile/',   SeekerProfileView.as_view(),           name='seeker-profile'),
    path('employer-profile/', EmployerProfileView.as_view(),         name='employer-profile'),
    path('forgot-password/',  ForgotPasswordView.as_view(),          name='forgot-password'),
    path('reset-password/',   ResetPasswordView.as_view(),           name='reset-password'),
]

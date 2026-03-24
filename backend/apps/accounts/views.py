from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from .serializers import (
    RegisterSerializer, UserSerializer,
    SeekerProfileSerializer, EmployerProfileSerializer,
    CustomTokenObtainPairSerializer,
)
from .models import SeekerProfile, EmployerProfile

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'message': 'Account created successfully. Please log in.'},
            status=status.HTTP_201_CREATED
        )


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class SeekerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = SeekerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = SeekerProfile.objects.get_or_create(user=self.request.user)
        return profile


class EmployerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = EmployerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = EmployerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'company_name': self.request.user.get_full_name()}
        )
        return profile


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            # Generate token
            token = default_token_generator.make_token(user)
            uid   = urlsafe_base64_encode(force_bytes(user.pk))

            # Build reset link — points to frontend
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_link   = f"{frontend_url}/reset-password?uid={uid}&token={token}"

            send_mail(
                subject='JobHub — Reset Your Password',
                message=(
                    f"Hi {user.get_full_name() or user.username},\n\n"
                    f"You requested a password reset for your JobHub account.\n\n"
                    f"Click the link below to set a new password:\n{reset_link}\n\n"
                    f"This link expires in 24 hours.\n\n"
                    f"If you did not request this, please ignore this email.\n\n"
                    f"— The JobHub Team"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass  # Don't reveal whether email exists

        # Always return success to prevent email enumeration
        return Response({'message': 'If that email is registered, a reset link has been sent.'})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid      = request.data.get('uid', '')
        token    = request.data.get('token', '')
        password = request.data.get('password', '')

        if not all([uid, token, password]):
            return Response({'error': 'uid, token and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user    = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'This reset link has expired or already been used.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response({'message': 'Password reset successfully. You can now log in.'})

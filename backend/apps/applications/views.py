from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Application
from .serializers import ApplicationSerializer, ApplicationStatusSerializer


class ApplyToJobView(generics.CreateAPIView):
    """Job seekers apply to a job."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        application = serializer.save()

        # Notify employer by email
        try:
            employer = application.job.employer
            send_mail(
                subject=f"New Application: {application.job.title}",
                message=(
                    f"Hi {employer.get_full_name()},\n\n"
                    f"{application.applicant.get_full_name()} has applied for '{application.job.title}'.\n"
                    f"Log in to Job Hub to review the application.\n\nJob Hub Team"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[employer.email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SeekerApplicationListView(generics.ListAPIView):
    """List all applications by the logged-in seeker."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user)


class EmployerApplicationListView(generics.ListAPIView):
    """List all applications for a specific job (employer only)."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        return Application.objects.filter(
            job__id=job_id,
            job__employer=self.request.user
        )


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """Employer updates application status."""
    serializer_class = ApplicationStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(job__employer=self.request.user)

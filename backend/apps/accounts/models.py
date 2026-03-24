from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user supporting two roles: Job Seeker and Employer."""

    ROLE_CHOICES = [
        ('seeker', 'Job Seeker'),
        ('employer', 'Employer'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_employer(self):
        return self.role == 'employer'

    def is_seeker(self):
        return self.role == 'seeker'

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"


class SeekerProfile(models.Model):
    """Extended profile for job seekers."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seeker_profile')
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text='Comma-separated list of skills')
    experience_years = models.PositiveIntegerField(default=0)
    education = models.CharField(max_length=255, blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()}'s Seeker Profile"


class EmployerProfile(models.Model):
    """Extended profile for employers."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255)
    company_description = models.TextField(blank=True)
    company_website = models.URLField(blank=True)
    company_logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.company_name}"

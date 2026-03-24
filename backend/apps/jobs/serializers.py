from rest_framework import serializers
from .models import Job, JobCategory
from apps.accounts.serializers import EmployerProfileSerializer


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.SerializerMethodField()
    employer_logo = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'requirements', 'responsibilities',
            'location', 'job_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency',
            'status', 'deadline', 'created_at', 'updated_at',
            'employer', 'employer_name', 'employer_logo',
            'category', 'category_name', 'applications_count',
        ]
        read_only_fields = ['employer', 'created_at', 'updated_at']

    def get_employer_name(self, obj):
        try:
            return obj.employer.employer_profile.company_name
        except Exception:
            return obj.employer.get_full_name()

    def get_employer_logo(self, obj):
        try:
            logo = obj.employer.employer_profile.company_logo
            if logo:
                request = self.context.get('request')
                return request.build_absolute_uri(logo.url) if request else logo.url
        except Exception:
            pass
        return None

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_applications_count(self, obj):
        return obj.applications.count()

    def create(self, validated_data):
        validated_data['employer'] = self.context['request'].user
        return super().create(validated_data)

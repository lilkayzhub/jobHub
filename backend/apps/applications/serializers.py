from rest_framework import serializers
from .models import Application
from apps.accounts.serializers import UserSerializer
from apps.jobs.serializers import JobSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.SerializerMethodField()
    applicant_email = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'applicant', 'cover_letter', 'resume',
            'status', 'applied_at', 'updated_at',
            'applicant_name', 'applicant_email', 'job_title',
        ]
        read_only_fields = ['applicant', 'applied_at', 'updated_at', 'status']

    def get_applicant_name(self, obj):
        return obj.applicant.get_full_name()

    def get_applicant_email(self, obj):
        return obj.applicant.email

    def get_job_title(self, obj):
        return obj.job.title

    def create(self, validated_data):
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)


class ApplicationStatusSerializer(serializers.ModelSerializer):
    """Used by employers to update application status only."""
    class Meta:
        model = Application
        fields = ['id', 'status']

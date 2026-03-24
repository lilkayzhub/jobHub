from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, JobCategory
from .serializers import JobSerializer, JobCategorySerializer


class IsEmployerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'employer'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.employer == request.user


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsEmployerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'experience_level', 'status', 'category', 'location']
    search_fields = ['title', 'description', 'location', 'requirements']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']

    def get_queryset(self):
        # Public listing: only open jobs; employers see their own too
        user = self.request.user
        if user.is_authenticated and user.role == 'employer':
            return Job.objects.filter(employer=user)
        return Job.objects.filter(status='open')


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsEmployerOrReadOnly]


class PublicJobListView(generics.ListAPIView):
    """All open jobs — accessible without authentication."""
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'experience_level', 'category']
    search_fields = ['title', 'description', 'location', 'requirements']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return Job.objects.filter(status='open')


class JobCategoryListView(generics.ListAPIView):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]

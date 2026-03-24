from django.urls import path
from .views import (
    ApplyToJobView, SeekerApplicationListView,
    EmployerApplicationListView, ApplicationStatusUpdateView,
)

urlpatterns = [
    path('apply/', ApplyToJobView.as_view(), name='apply'),
    path('my/', SeekerApplicationListView.as_view(), name='my-applications'),
    path('job/<int:job_id>/', EmployerApplicationListView.as_view(), name='job-applications'),
    path('<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status'),
]

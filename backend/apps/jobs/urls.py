from django.urls import path
from .views import JobListCreateView, JobDetailView, PublicJobListView, JobCategoryListView

urlpatterns = [
    path('', PublicJobListView.as_view(), name='public-jobs'),
    path('manage/', JobListCreateView.as_view(), name='manage-jobs'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('categories/', JobCategoryListView.as_view(), name='job-categories'),
]

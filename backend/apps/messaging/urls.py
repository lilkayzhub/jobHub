from django.urls import path
from .views import InboxView, SentView, SendMessageView, MessageDetailView

urlpatterns = [
    path('inbox/', InboxView.as_view(), name='inbox'),
    path('sent/', SentView.as_view(), name='sent'),
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
]

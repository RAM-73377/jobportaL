from django.urls import path
from .views import BlogPostListView, BlogPostDetailView

urlpatterns = [
    path('posts/', BlogPostListView.as_view(), name='blog-post-list'),
    path('posts/<int:id>/', BlogPostDetailView.as_view(), name='blog-post-detail'),
]
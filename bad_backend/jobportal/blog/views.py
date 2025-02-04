from rest_framework.views import APIView
from rest_framework.response import Response
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostListView(APIView):
    def get(self, request):
        posts = BlogPost.objects.all()
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)

class BlogPostDetailView(APIView):
    def get(self, request, id):
        post = BlogPost.objects.get(id=id)
        serializer = BlogPostSerializer(post)
        return Response(serializer.data)
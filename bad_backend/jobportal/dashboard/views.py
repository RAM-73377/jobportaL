from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import JobStats, RecentActivity
from .serializers import JobStatsSerializer, RecentActivitySerializer

class JobStatsView(APIView):
    def get(self, request):
        stats = JobStats.objects.first()
        serializer = JobStatsSerializer(stats)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobStatsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecentActivityView(APIView):
    def get(self, request):
        activities = RecentActivity.objects.all().order_by('-timestamp')
        serializer = RecentActivitySerializer(activities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecentActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

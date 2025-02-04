from rest_framework import serializers
from .models import JobStats, RecentActivity

class JobStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStats
        fields = '__all__'

class RecentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentActivity
        fields = '__all__'

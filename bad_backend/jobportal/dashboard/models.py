from django.db import models

# Create your models here.
from django.db import models

class JobStats(models.Model):
    applied = models.IntegerField(default=0)
    interviews = models.IntegerField(default=0)
    offers = models.IntegerField(default=0)
    rejected = models.IntegerField(default=0)
    pending = models.IntegerField(default=0)

class RecentActivity(models.Model):
    activity = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

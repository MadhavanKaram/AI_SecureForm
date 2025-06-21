from rest_framework import serializers
from .models import Submission

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'title', 'form_code', 'analysis_result', 'score', 'badges', 'created_at']

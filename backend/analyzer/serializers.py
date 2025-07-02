from rest_framework import serializers
from .models import Submission

class SubmissionSerializer(serializers.ModelSerializer):
    secure_code = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ['id', 'title', 'form_code', 'analysis_result', 'score', 'badges', 'created_at', 'secure_code']

    def get_secure_code(self, obj):
        return getattr(obj, 'secure_code', '') or ''

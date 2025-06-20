from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Submission
from .utils import analyze_form_code
from .serializers import SubmissionSerializer
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view

# analyzer/views.py
class SubmissionSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        submissions = Submission.objects.filter(form_code__icontains=query).order_by('-created_at')
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class SubmitFormView(APIView):
    def post(self, request):
        form_code = request.data.get('form_code')
        if not form_code:
            return Response({'error': 'No form code provided'}, status=400)

        # Dummy analysis (replace with real logic)
        analysis = "Looks like a basic login form.\nCSRF token missing."
        score = 45
        submission = Submission.objects.create(
            content=form_code,
            result=analysis,
            score=score
        )
        return Response({
            'score': score,
            'analysis': analysis,
            'submission_id': submission.id
        })

    

        return Response({
            "id": submission.id,
            "title": title,
            "form_code": form_code,
            "analysis_result": analysis_result,
            "score": score,
            "badges": badges,
            "created_at": submission.created_at
        })

class SubmissionHistoryView(APIView):
    def get(self, request):
        submissions = Submission.objects.all().order_by('-created_at')
        data = []

        for sub in submissions:
            data.append({
                "id": sub.id,
                "title": sub.title,
                "form_code": sub.form_code,
                "analysis_result": sub.analysis_result,
                "created_at": sub.created_at,
                "score": None,
                "badges": []
            })

        return Response(data)

class AnalyzeFormView(APIView):
    def post(self, request):
        form_code = request.data.get('form_code')
        if not form_code:
            return Response({'error': 'No form code provided'}, status=400)
        # Use your real analysis logic here
        # For now, use dummy values
        # analysis_result, score, badges = analyze_form_code(form_code)
        analysis_result = "Looks like a basic login form. CSRF token missing."
        score = 45
        badges = ["XSS Risk", "No CSRF"]
        # Optionally save to DB
        submission = Submission.objects.create(
            title="Analyzed Submission",
            form_code=form_code,
            analysis_result=analysis_result,
            score=score,
            badges=badges
        )
        return Response({
            'score': score,
            'analysis_result': analysis_result,
            'badges': badges,
            'submission_id': submission.id
        })

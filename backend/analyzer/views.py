from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FormSubmission
from .utils import analyze_form_code

class SubmitFormView(APIView):
    def post(self, request):
        title = request.data.get('title')
        form_code = request.data.get('form_code')

        analysis_result, score, badges = analyze_form_code(form_code)

        submission = FormSubmission.objects.create(
            title=title,
            form_code=form_code,
            analysis_result=analysis_result
        )

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
        submissions = FormSubmission.objects.all().order_by('-created_at')
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

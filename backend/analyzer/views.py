from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Submission
from .utils import analyze_form_code
from .serializers import SubmissionSerializer
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

# analyzer/views.py
class SubmissionSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        if query.strip() == '':
            # If no query, return the most recent 10 submissions
            submissions = Submission.objects.all().order_by('-created_at')[:10]
        else:
            submissions = Submission.objects.filter(form_code__icontains=query).order_by('-created_at')
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class SubmitFormView(APIView):
    def post(self, request):
        form_code = request.data.get('form_code')
        if not form_code:
            return Response({'error': 'No form code provided'}, status=400)
        analysis_result, score, badges, code_type, recommendation = analyze_form_code(form_code)
        title = f"{code_type} Form" if code_type and code_type != 'Unknown' else "Untitled Submission"
        submission = Submission.objects.create(
            title=title,
            form_code=form_code,
            analysis_result=analysis_result,
            score=score,
            badges=badges
        )
        return Response({
            'score': score,
            'analysis_result': analysis_result,
            'badges': badges,
            'recommendation': recommendation,
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
                "score": sub.score,
                "badges": sub.badges
            })

        return Response(data)

class AnalyzeFormView(APIView):
    def post(self, request):
        form_code = request.data.get('form_code')
        if not form_code:
            return Response({'error': 'No form code provided'}, status=400)
        analysis_result, score, badges, code_type, recommendation = analyze_form_code(form_code)
        # Extract secure code from <RECOMMENDATION> if present
        secure_code = ''
        if recommendation:
            import re
            # Try to extract code block (triple backticks or lines starting with code)
            code_block = re.search(r'```([\s\S]+?)```', recommendation)
            if code_block:
                secure_code = code_block.group(1).strip()
            else:
                # Fallback: take lines until 'Explanation' or similar
                lines = recommendation.splitlines()
                code_lines = []
                for line in lines:
                    if line.strip().lower().startswith('explanation'):
                        break
                    code_lines.append(line)
                secure_code = '\n'.join(code_lines).strip()
        title = f"{code_type} Form" if code_type and code_type != 'Unknown' else "Untitled Submission"
        submission = Submission.objects.create(
            title=title,
            form_code=form_code,
            analysis_result=analysis_result,
            score=score,
            badges=badges,
            secure_code=secure_code
        )
        return Response({
            'score': score,
            'analysis_result': analysis_result,
            'badges': badges,
            'recommendation': recommendation,
            'secure_code': secure_code,
            'submission_id': submission.id
        })

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            })
        else:
            return Response({'error': 'Not authenticated'}, status=401)

class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        if not username or not email or not password:
            return Response({'success': False, 'error': 'All fields are required.'}, status=400)
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({'success': False, 'error': 'Username or email already exists.'}, status=400)
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'success': True})

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'success': False, 'error': 'Invalid email or password.'}, status=400)
        user = authenticate(username=user.username, password=password)
        if user is not None:
            return Response({'success': True})
        else:
            return Response({'success': False, 'error': 'Invalid email or password.'}, status=400)

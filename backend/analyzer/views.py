from .chat_models import ChatSession, ChatMessage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone

# Multi-turn chat endpoint
# Multi-turn chat endpoint
from rest_framework.permissions import AllowAny

class ChatAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # print("ChatAPIView POST called")  # Remove or comment out debug prints
        import os
        import openai

        messages = request.data.get('messages', [])
        if not messages:
            return Response({'error': 'No messages provided.'}, status=400)

        # Convert 'ai' role to 'assistant' for OpenAI API
        openai_messages = []
        for m in messages:
            role = 'assistant' if m['role'] == 'ai' else m['role']
            openai_messages.append({'role': role, 'content': m['content']})

        # Use Azure OpenAI for multi-turn chat
        try:
            from openai import AzureOpenAI
            api_key = os.getenv("AZURE_OPENAI_API_KEY")
            azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
            api_version = os.getenv("AZURE_OPENAI_API_VERSION")
            deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

            if not all([api_key, azure_endpoint, api_version, deployment]):
                raise Exception("One or more Azure OpenAI environment variables are missing.")

            client = AzureOpenAI(
                api_key=api_key,
                azure_endpoint=azure_endpoint,
                api_version=api_version
            )

            response = client.chat.completions.create(
                model=deployment,
                messages=openai_messages,
                temperature=0.7,
                max_tokens=512
            )

            ai_reply = response.choices[0].message.content

        except Exception as e:
            print("CHAT API ERROR:", str(e))  # Log the error to the console
            ai_reply = f"Sorry, there was an error: {str(e)}"


        # Optionally, save the chat session and messages only if user is authenticated
        if request.user.is_authenticated:
            session, _ = ChatSession.objects.get_or_create(user=request.user, updated_at__date=timezone.now().date())
            for m in messages:
                ChatMessage.objects.create(session=session, role=m['role'], content=m['content'])
            ChatMessage.objects.create(session=session, role='ai', content=ai_reply)

        return Response({'reply': ai_reply})

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse

# API endpoint to check authentication status
from rest_framework.decorators import api_view, authentication_classes, permission_classes

@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([AllowAny])
def check_auth_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    else:
        return JsonResponse({'authenticated': False})
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

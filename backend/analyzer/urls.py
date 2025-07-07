from django.urls import path
from .views import SubmitFormView, SubmissionHistoryView, SubmissionSearchView, AnalyzeFormView, UserDetailsView, SignupView, LoginView, check_auth_view, ChatAPIView, logout_view

urlpatterns = [
    path('submit/', SubmitFormView.as_view(), name='submit-form'),
    path('history/', SubmissionHistoryView.as_view(),name='submission-history'),
    path('search/', SubmissionSearchView.as_view(), name='submission-search'),
    path('analyze/', AnalyzeFormView.as_view(), name='analyze-form'),
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-auth/', check_auth_view, name='check-auth'),
    path('logout/', logout_view, name='logout'),
    path('chat/', ChatAPIView.as_view(), name='chat'),
]
# The yellow line in many code editors (like VS Code or PyCharm) usually indicates a warning.
# In this context, it's likely warning that 'SubmissionHistoryView' is used but not imported.
# You should import SubmissionHistoryView from your views to resolve the warning:

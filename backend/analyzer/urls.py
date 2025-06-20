from django.urls import path
from .views import SubmitFormView, SubmissionHistoryView

urlpatterns = [
    path('submit/', SubmitFormView.as_view(), name='submit-form'),
    path('history/', SubmissionHistoryView.as_view()),
]
# The yellow line in many code editors (like VS Code or PyCharm) usually indicates a warning.
# In this context, it's likely warning that 'SubmissionHistoryView' is used but not imported.
# You should import SubmissionHistoryView from your views to resolve the warning:

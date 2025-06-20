from django.db import models
class Submission(models.Model):
   
   title = models.CharField(max_length=100)
   form_code = models.TextField()
   analysis_result = models.JSONField(null=True, blank=True)
   created_at = models.DateTimeField(auto_now_add=True)
   score = models.IntegerField(null=True, blank=True)
   badges = models.JSONField(null=True, blank=True)



def __str__(self):
        return self.title
# Create your models here.

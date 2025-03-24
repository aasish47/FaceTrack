from django.db import models
from Registration.models import User

class UserAttendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_in = models.TimeField()
    time_out = models.TimeField()
    date = models.DateField()

    class Meta:
        db_table = 'user_attendance'
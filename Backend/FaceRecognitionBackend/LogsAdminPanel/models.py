from django.db import models

class UserAttendance(models.Model):
    user_id = models.IntegerField(primary_key=True) 
    time_in = models.TimeField()
    time_out = models.TimeField()
    date = models.DateField()

    class Meta:
        db_table = 'user_attendance'  # Link to the existing MySQL table


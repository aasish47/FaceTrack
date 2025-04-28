from django.db import models
from Registration.models import User
from Login.models import User as LoginDetails

class UserAttendance(models.Model):
    id = models.AutoField(primary_key=True)  
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    time_in = models.TimeField()
    time_out = models.TimeField()
    date = models.DateField()

    class Meta:
        db_table = 'user_attendance'
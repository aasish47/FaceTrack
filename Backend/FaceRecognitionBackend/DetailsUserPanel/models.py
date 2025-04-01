from django.db import models
from Registration.models import User as RegistrationUser
from DetailsAdminPanel.models import UserAttendance
from django.db import models

class AttendanceRequest(models.Model):
    Id = models.AutoField(primary_key=True)
    UserId = models.CharField(max_length=50)
    Name = models.CharField(max_length=100)
    Email = models.CharField(max_length=100)
    Date = models.CharField(max_length=100)
    Type = models.CharField(max_length=100)
    Reason = models.CharField(max_length=250)
    class Meta:
        db_table = 'Attendance_Request' 

    def __str__(self):
        return f"{self.Name} - {self.Type} on {self.Date}"
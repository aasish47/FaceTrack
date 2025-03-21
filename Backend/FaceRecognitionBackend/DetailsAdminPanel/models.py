from django.db import models

class User(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    fullname = models.CharField(max_length=100)
    designation = models.CharField(max_length=20)
    department = models.CharField(max_length=20, null=True, blank=True)
    image = models.BinaryField()
    objects = models.Manager()

    class Meta:
        db_table = 'user_details'

    def __str__(self):
        return self.id

class UserAttendance(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    time_in = models.TimeField()
    time_out = models.TimeField()
    date = models.DateField()

    class Meta:
        db_table = 'user_attendance'

from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.hashers import make_password

class RegistrationUser(models.Model):
    userId = models.CharField(max_length=50, primary_key=True)
    userName = models.CharField(max_length=100)
    userEmail = models.EmailField(max_length=100, unique=True)
    userDepartment = models.CharField(max_length=50)
    userDesignation = models.CharField(max_length=50)
    userPhoto = models.CharField(max_length=255)

    class Meta:
        managed = False  
        db_table = "Registration_user"

    def __str__(self):
        return self.userName

class RegistrationLoginDetails(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(RegistrationUser, on_delete=models.CASCADE, unique=True)
    hashed_password = models.CharField(max_length=128)

    class Meta:
        managed = False
        db_table = "Registration_logindetails"

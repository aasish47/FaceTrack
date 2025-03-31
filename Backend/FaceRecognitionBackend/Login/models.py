from django.db import models

class AdminUser(models.Model):
    id = models.AutoField(primary_key=True)
    admin_id = models.CharField(max_length=50, unique=True)
    hashed_password = models.CharField(max_length=128)  # Store hashed passwords securely

    class Meta:
        db_table = "admin_credentials"

class NormalUser(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=50, unique=True)
    hashed_password = models.CharField(max_length=128)  # Store hashed passwords securely

    class Meta:
        db_table = "Registration_logindetails"
        managed = False


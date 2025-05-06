from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=50, unique=True)
    hashed_password = models.CharField(max_length=128) 
    role  = models.CharField(max_length=20) 

    class Meta:
        db_table = "Registration_logindetails"
        managed = False

    @property
    def is_authenticated(self):
        return True

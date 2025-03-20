from django.db import models 

#User Model
class User(models.Model):
    userId= models.CharField(max_length= 50, primary_key= True)
    userName= models.CharField(max_length= 100)
    userEmail= models.CharField(max_length= 100)
    userDepartment= models.CharField(max_length= 50)
    userDesignation= models.CharField(max_length= 50)
    userPhoto = models.CharField(max_length=255)

    def __str__(self):
        return self.userName

# Log in details for user
class LoginDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Assuming User is your user model
    hashed_password = models.CharField(max_length=128, default= "default_password")  # Adjust the length as needed

    def __str__(self):
        return f"{self.user.userName}'s login details"
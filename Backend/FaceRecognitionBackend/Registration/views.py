# from Registration.models import User, LoginDetails
# from Registration.serializers import UserSerializer
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.parsers import JSONParser
# from django.http.response import JsonResponse
# from django.core.mail import send_mail
# from django.contrib.auth.hashers import make_password
# import string
# import random
# from django.core.files.storage import default_storage


# @csrf_exempt
# def userApi(request, id=0):
    
#     #For GET method
#     if request.method == 'GET':
#         user = User.objects.all()
#         user_serializer = UserSerializer(user, many = True)
#         return JsonResponse(user_serializer.data, safe= False)
    
#     #For POST method
#     elif request.method == 'POST':
#         user_data = JSONParser().parse(request)

#         user_serializer = UserSerializer(data = user_data)
#         if user_serializer.is_valid():
#             user = user_serializer.save()
            

#             #generating password
#             def generate_password(length=12):
#                 characters = string.ascii_letters + string.digits + string.punctuation
#                 return ''.join(random.choice(characters) for _ in range(length))
            
#             #Hashing password
#             password = generate_password()
#             hashed_password = make_password(password)

#             #sending email to user
#             subject = 'Registration successful'
#             message = f'''Dear {user.userName}, your registration is successful.\nYour user id is: {user.userId}.\nYour password is: {password}'''
#             email = user.userEmail
            
#             # Ensure that the email is valid before sending
#             if email:
#                 EMAIL_HOST_USER = 'aasish6001@gmail.com'
#                 recipient_list = [email]
                
#                 try:
#                     send_mail(subject, message, EMAIL_HOST_USER, recipient_list, fail_silently=False)
#                 except Exception as e:
#                     return JsonResponse(f"User  added, but failed to send email: {str(e)}", safe=False)
#             else:
#                 return JsonResponse("User  added, but no email provided.", safe=False)
            
#             #Saving id and password in LoginDetails table
#             login_details = LoginDetails(user = user, hashed_password = hashed_password)
#             login_details.save()

#             return JsonResponse("Added successfully!!", safe= False)
#         return JsonResponse("Failed to add", safe= False)
    
#     #For PUT method
#     elif request.method == 'PUT':
#         user_data = JSONParser().parse(request)
#         user = User.objects.get(userId = user_data['userId'])
#         user_serializer = UserSerializer(user, data = user_data)
#         if user_serializer.is_valid():
#             user_serializer.save()
#             return JsonResponse("Updated successfully!!", safe= False)
#         return JsonResponse("Failed to update", safe= False)
    
#     #For DELETE method
#     elif request.method == 'DELETE':
#         user = User.objects.get(userId = id)
        
#         # Delete the login details
#         login_details = LoginDetails.objects.get(user=user)
#         login_details.delete()  

#         #Delete user
#         user.delete()
#         return JsonResponse("Deleted Successfully!!", safe= False)





from Registration.models import User, LoginDetails
from Registration.serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
import string
import random
import base64
import os
from django.conf import settings

@csrf_exempt
def userApi(request, id=0):
    # For GET method
    if request.method == 'GET':
        user = User.objects.all()
        user_serializer = UserSerializer(user, many=True)
        return JsonResponse(user_serializer.data, safe=False)

    # For POST method
    elif request.method == 'POST':
        user_data = JSONParser().parse(request)

        # Decode base64 image and save it
        if 'userPhoto' in user_data:
            try:
                format, imgstr = user_data['userPhoto'].split(';base64,')  # Extract format and base64
                ext = format.split('/')[-1]  # Extract file extension (jpg, png, etc.)
                file_name = f"user_{user_data['userId']}.{ext}"  # Unique filename

                image_path = os.path.join(settings.MEDIA_ROOT, 'user_images', file_name)  # Save in 'user_images' directory
                os.makedirs(os.path.dirname(image_path), exist_ok=True)  # Ensure directory exists

                with open(image_path, "wb") as img_file:
                    img_file.write(base64.b64decode(imgstr))  # Decode and write to file

                user_data['userPhoto'] = f"user_images/{file_name}"  # Store relative path in DB
            except Exception as e:
                return JsonResponse(f"Failed to process image: {str(e)}", safe=False)

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            
            # Generating password
            def generate_password(length=12):
                characters = string.ascii_letters + string.digits + string.punctuation
                return ''.join(random.choice(characters) for _ in range(length))

            # Hashing password
            password = generate_password()
            hashed_password = make_password(password)

            # Sending email to user
            subject = 'Registration successful'
            message = f'''Dear {user.userName}, your registration is successful.\nYour user id is: {user.userId}.\nYour password is: {password}'''
            email = user.userEmail

            if email:
                EMAIL_HOST_USER = 'aasish6001@gmail.com'
                recipient_list = [email]
                try:
                    send_mail(subject, message, EMAIL_HOST_USER, recipient_list, fail_silently=False)
                except Exception as e:
                    return JsonResponse(f"User added, but failed to send email: {str(e)}", safe=False)
            else:
                return JsonResponse("User added, but no email provided.", safe=False)

            # Saving id and password in LoginDetails table
            login_details = LoginDetails(user=user, hashed_password=hashed_password)
            login_details.save()
            

            return JsonResponse("Added successfully!!", safe=False)
        return JsonResponse("Failed to add", safe=False)

    # For PUT method
    elif request.method == 'PUT':
        user_data = JSONParser().parse(request)
        user = User.objects.get(userId=user_data['userId'])
        user_serializer = UserSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Updated successfully!!", safe=False)
        return JsonResponse("Failed to update", safe=False)

    # For DELETE method
    elif request.method == 'DELETE':
        user = User.objects.get(userId=id)
        
        # Delete the login details
        login_details = LoginDetails.objects.get(user=user)
        login_details.delete()  

        # Delete user
        user.delete()
        return JsonResponse("Deleted Successfully!!", safe=False)

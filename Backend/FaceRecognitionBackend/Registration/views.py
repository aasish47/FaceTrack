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
import subprocess
from django.conf import settings
import shutil


python_cmd = shutil.which("python") or shutil.which("python3")

PRECOMPUTE_EMBEDDINGS = os.path.join(os.path.dirname(settings.BASE_DIR), 'model', 'precomputeEmbeddings.py')

@csrf_exempt
def userApi(request, id=0):
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
                format, imgstr = user_data['userPhoto'].split(';base64,') 
                ext = format.split('/')[-1]  
                file_name = f"{user_data['userId']}.{ext}"  

                image_path = os.path.join(settings.MEDIA_ROOT, 'user_images', file_name)  
                os.makedirs(os.path.dirname(image_path), exist_ok=True)  

                with open(image_path, "wb") as img_file:
                    img_file.write(base64.b64decode(imgstr))  

                user_data['userPhoto'] = f"user_images/{file_name}"  
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
            
            # Call embedding script after successful user registration
            if image_path:
                try:
                    subprocess.run([python_cmd, PRECOMPUTE_EMBEDDINGS, image_path], check=True)
                except subprocess.CalledProcessError as e:
                    return JsonResponse(f"User added, but embedding generation failed: {str(e)}", safe=False)

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
        try:
            user = User.objects.get(userId=id) 
        except User.DoesNotExist:
            return JsonResponse("User not found", safe=False, status=404)

    # Check if LoginDetails exists before deleting
        login_details = LoginDetails.objects.filter(user=user).first()
        if login_details:
            login_details.delete()  

    # Delete user
        user.delete()
        return JsonResponse("Deleted Successfully!!", safe=False)

@csrf_exempt
def check_user_exists(request, user_id):
    exists = User.objects.filter(userId=user_id).exists()
    return JsonResponse({'exists': exists})

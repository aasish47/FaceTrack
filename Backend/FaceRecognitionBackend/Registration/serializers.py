from rest_framework import serializers
from Registration.models import User
import base64
from django.core.files.base import ContentFile
#User serializer

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields= ('userId',
                 'userName',
                 'userEmail',
                 'userDepartment',
                 'userDesignation',
                 'userPhoto'
                 )
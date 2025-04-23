from rest_framework import serializers
from Registration.models import User, Department
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

#Department serializer
class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Department
        fields= ('departmentId',
                 'departmentName',
                 'departmentHead'
                 )
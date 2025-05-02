from rest_framework import serializers
from .models import CustomUser, Student, Lecturer, Admin, Course, Semester, Enrollment, ResultPermission


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True)  # Set password as write-only

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'full_name', 'email', 'contact',
                  'user_type', 'is_staff', 'is_active', 'password']
        read_only_fields = ['id']  # 'id' should not be included when writing

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            **validated_data)
        return user

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['reg_no', 'index_no', 'year_joined', 'user']



class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = '__all__'


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_code', 'course_name', 'semester_number', 'level']

class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'year_start', 'year_end', 'semester_number', 'is_current']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course_code', 'student', 'semester', 'result_permission', 'exam_type', 'coursework_marks', 'exam_marks']

class ResultPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultPermission
        fields = ['id', 'course', 'marks_published']

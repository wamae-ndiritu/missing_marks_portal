from django.db import models, IntegrityError
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import pre_save
from django.dispatch import receiver

class CustomUserManager(BaseUserManager):
    def create_user(self, username, user_type, password=None, **extra_fields):
        if not username:
            raise ValueError('The username must be set')
        if not user_type:
            raise ValueError('The user type must be set')
        user = self.model(username=username,
                          user_type=user_type, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, user_type, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, user_type, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('admin', 'Admin'),
    )

    username = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=15)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=True, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['user_type', 'email']

    def has_perm(self, perm, obj=None):
        # Handle custom permissions logic here
        return True

    def has_module_perms(self, app_label):
        # Handle custom module permissions logic here
        return True

    def __str__(self):
        return self.username
    

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE) # Relationship
    reg_no = models.CharField(max_length=20, unique=True)
    index_no = models.CharField(max_length=20)
    year_joined = models.IntegerField()

    def __str__(self):
        return self.reg_no

class Lecturer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    staff_no = models.CharField(max_length=100, null=True, blank=True)


class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class Course(models.Model):
    SEMESTER_CHOICES = [
        (1, 'I'),
        (2, 'II'),
    ]
    course_code = models.CharField(primary_key=True, max_length=30, unique=True)
    course_name = models.CharField(max_length=200, unique=True)
    level = models.IntegerField(default=None, null=True)
    semester_number = models.IntegerField(choices=SEMESTER_CHOICES, null=True)

class Semester(models.Model):
    SEMESTER_CHOICES = [
        (1, 'I'),
        (2, 'II'),
    ]
    id = models.CharField(max_length=50, default="", blank=True, primary_key=True, unique=True)
    year_start = models.IntegerField()
    year_end = models.IntegerField()
    semester_number = models.IntegerField(choices=SEMESTER_CHOICES, null=True)
    is_current = models.BooleanField(default=False)

   # Override the clean method to ensure id is generated automatically
    def clean(self):
        # Check if the object is new (not saved before)
        if not self.pk:
            # Generate id based on year_start, year_end, and semester_number
            self.id = f"{self.year_start}/{self.year_end} - SEM {self.semester_number}"
        super().clean()

    # Override the save method to generate custom primary key
    def save(self, *args, **kwargs):
        # Call clean method to ensure id is generated
        self.clean()
        super().save(*args, **kwargs)


class ResultPermission(models.Model):
    course = models.OneToOneField(Course, on_delete=models.SET_NULL, null=True)
    marks_published = models.BooleanField(default=False)

class Enrollment(models.Model):
    EXAM_TYPE_CHOICES = [
        ('supplementary', 'Supplementary'),
        ('first attempt', 'First Attempt'),
    ]
    course_code = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, null=True, on_delete=models.SET_NULL)
    coursework_marks = models.IntegerField(null=True, default=0)
    exam_marks = models.IntegerField(null=True, default=0)
    score = models.IntegerField(null=True, default=0)
    exam_type = models.CharField(
        max_length=100, choices=EXAM_TYPE_CHOICES, default='first attempt')
    result_permission = models.ForeignKey(ResultPermission, null=True, on_delete=models.SET_NULL)
    grade = models.CharField(max_length=1, default='', null=True)

    def __str__(self):
        return f"{self.student} - {self.course_code.course_code} - {self.semester.year_start}/{self.semester.year_end} - {self.exam_type}"

    class Meta:
        # Define unique constraint for student and course_code combination
        unique_together = ('student', 'course_code')


class MissingMarks(models.Model):
    enrollment = models.ForeignKey(
        Enrollment, on_delete=models.CASCADE)
    missing_marks = models.BooleanField(default=False)
    missing_marks_reason = models.TextField(null=True, blank=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Missing marks for {self.enrollment.student} in {self.enrollment.course_code.course_code} - Resolved: {self.resolved}"

class Teaching(models.Model):
    course = models.ForeignKey(
        Course, null=True, on_delete=models.CASCADE)
    lecturer = models.ForeignKey(Lecturer, on_delete=models.CASCADE)
    semester = models.ForeignKey(
        Semester, null=True, on_delete=models.CASCADE)
    
    class Meta:
        # Define unique constraint for lecturer and course combination
        unique_together = ('course', 'semester')
    
    def save(self, *args, **kwargs):
        try:
            super().save(*args, **kwargs)
        except IntegrityError as e:
            if 'UNIQUE constraint' in str(e):
                raise ValidationError(
                    "This course is already assigned to another lecturer in the selected semester.")
            else:
                raise e  # Re-raise the error if it's not related to the unique constraint
    
    def __str__(self):
        return f"{self.lecturer} - {self.course} - {self.semester}"



from rest_framework.exceptions import ValidationError as DRFValidationError
from app.models import Lecturer, Course, Semester, Teaching
from django.db.utils import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import get_object_or_404
from .helpers import generate_random_password, send_password_email, send_results_notification, send_missing_results_notification, send_missing_mark_notification_to_lecturer, send_missing_mark_report_update
from django.db.models import Count, Avg
import json
from .serializers import StudentSerializer, LecturerSerializer, CustomUserSerializer, CourseSerializer, SemesterSerializer, EnrollmentSerializer, ResultPermissionSerializer
from .models import CustomUser, Student, Lecturer, Course, Semester, Enrollment, ResultPermission, Teaching, MissingMarks


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_students(request):
    if request.method == 'POST':
        data = request.data
        usersList = []
        errors = []
        save_count = 0
        total_items = len(data)
        for userObj in data:
            userObj["username"] = userObj['reg_no']
            userObj["password"] = userObj['index_no']
            try:
                user = CustomUser.objects.get(username=userObj['username'])
                continue
            except CustomUser.DoesNotExist:
                serializer = CustomUserSerializer(data=userObj)
                if serializer.is_valid():
                    user = serializer.save()

                    # Create student
                    student_data = {
                        'reg_no': userObj.get('reg_no'),
                        'index_no': userObj.get('index_no'),
                        'year_joined': userObj.get('year_joined'),
                        'user': user.id
                    }

                    # Serialize student data
                    student_serializer = StudentSerializer(data=student_data)
                    if student_serializer.is_valid():
                        student_serializer.save()

                        user_data = {
                            **serializer.data,
                            **student_serializer.data
                        }

                        usersList.append(user_data)
                        save_count += 1
                    else:
                        errors.append(student_serializer.errors)
                else:
                    errors.append(serializer.errors)
        return Response({"updates_count": save_count, "total_items": total_items}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_lecturers(request):
    """
    Admin add Lecturer list
    """
    if request.method == 'POST':
        data = request.data
        usersList = []
        errors = []
        if len(data) == 0:
            return Response({"message": "Empty file!"}, status=status.HTTP_400_BAD_REQUEST)
        save_count = 0
        total_items = len(data)
        for userObj in data:
            random_pass = generate_random_password()
            userObj['username'] = userObj.get('staff_no')
            userObj["password"] = random_pass
            serializer = CustomUserSerializer(data=userObj)
            if serializer.is_valid():
                user = serializer.save()
                lecturer_data = {
                    'user': user.id,
                    'staff_no': userObj['staff_no']
                }

                lecturer_serializer = LecturerSerializer(data=lecturer_data)
                if lecturer_serializer.is_valid():
                    lecturer_serializer.save()
                    send_password_email(userObj['email'], random_pass)
                    user_data = {
                        **serializer.data,
                        **lecturer_serializer.data
                    }
                    save_count += 1
                    usersList.append(user_data)
                else:
                    errors.append(lecturer_serializer.errors)
            else:
                errors.append(serializer.errors)
        return Response({"updates_count": save_count, "total_items": total_items}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)

# Get all Lecturers


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lecturers(request):
    """
    Admin get all Lecturer objects
    """
    if request.method == 'GET':
        query_params = request.query_params
        search_id = query_params.get('staffId')
        if search_id:
            lecturers = []
            try:
                lecturer = Lecturer.objects.get(staff_no=search_id)
                lecturers.append({'lecturer_id': lecturer.id, 'user_id': lecturer.user.id, 'staff_no': lecturer.staff_no,
                                 'full_name': lecturer.user.full_name, 'contact': lecturer.user.contact, 'email': lecturer.user.email})
                return Response(lecturers, status=status.HTTP_200_OK)
            except Lecturer.DoesNotExist:
                return Response({"message": "No Lecturer matching the given STAFF ID!"}, status=status.HTTP_404_NOT_FOUND)
        lecturers = Lecturer.objects.all()
        users = [{'lecturer_id': lecturer.id, 'user_id': lecturer.user.id, 'staff_no': lecturer.staff_no,
                  'full_name': lecturer.user.full_name, 'contact': lecturer.user.contact, 'email': lecturer.user.email} for lecturer in lecturers]
        return Response(users, status=status.HTTP_200_OK)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)

# Get all students


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_students(request):
    if request.method == 'GET':
        query_params = request.query_params
        search_id = query_params.get('searchReg')
        if search_id:
            students = []
            try:
                student = Student.objects.get(reg_no=search_id)
                user = CustomUser.objects.get(id=student.user_id)
                student_serializer = StudentSerializer(student)
                user_serializer = CustomUserSerializer(user)
                student_info = {
                    **student_serializer.data,
                    **user_serializer.data
                }
                students.append(student_info)
                return Response(students, status=status.HTTP_200_OK)
            except Student.DoesNotExist:
                return Response({"message": "No Student matching the given REG NO!"}, status=status.HTTP_404_NOT_FOUND)
        users_list = []
        students = Student.objects.all()
        for student in students:
            user = CustomUser.objects.get(id=student.user_id)
            student_serializer = StudentSerializer(student)
            user_serializer = CustomUserSerializer(user)
            student_info = {
                **student_serializer.data,
                **user_serializer.data
            }
            users_list.append(student_info)
        return Response(users_list, status=status.HTTP_200_OK)

# Update profile


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update contact and password
    """
    if request.method == 'PATCH':
        current_user = request.user
        user = CustomUser.objects.get(id=current_user.id)
        if request.data.get('contact'):
            user.contact = request.data.get('contact')
        elif request.data.get('password') and request.data.get('current_password'):
            if user.check_password(request.data.get('current_password')):
                user.set_password(request.data.get('password'))
            else:
                return Response({"message": "Wrong password!"}, status=status.HTTP_401_UNAUTHORIZED)
        user.save()
        return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)


# Login
@api_view(['POST'])
def login(request):
    data = request.data
    username = data.get('username', None)
    password = data.get('password', None)
    email = data.get('email', None)
    if not username:
        if not email:
            return Response({"message": "Username/email required!"}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({"message": "Password required!"}, status=status.HTTP_400_BAD_REQUEST)
    search_key = {}
    if username:
        search_key["username"] = username
    else:
        search_key["email"] = email
    try:
        user = CustomUser.objects.get(**search_key)

        if not user.check_password(password):
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        student_serializer = {}
        if user.user_type == 'student':
            student = Student.objects.get(user_id=user.id)
            student_serializer = StudentSerializer(student)

        serializer = CustomUserSerializer(user)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        user_info = {}

        if user.user_type == 'student':
            user_info = {
                **serializer.data,
                **student_serializer.data,
            }
        else:
            user_info = serializer.data

        res_data = {
            'user': user_info,
            'token': token
        }
        return Response(res_data, status=status.HTTP_200_OK)

    except CustomUser.DoesNotExist:
        return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if request.method == 'DELETE':
        try:
            user = CustomUser.objects.get(id=user_id)

            user.delete()
            return Response({"message": "User deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"message": "Not found!"}, status=status.HTTP_404_NOT_FOUND)


# Operations on semester
@api_view(['POST', 'GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def semester_view(request, semester_id=None):
    """
    Create, Get and Delete semester objects
    """
    if request.method == 'POST':
        serializer = SemesterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        # Get all semesters
        semesters = Semester.objects.all()
        serializer = SemesterSerializer(semesters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'GET' and semester_id:
        # Get semester by ID
        try:
            semester = Semester.objects.get(id=semester_id)
            serializer = SemesterSerializer(semester)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Semester.DoesNotExist:
            return Response({"message": "Not Found!"}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE' and semester_id:
        # Delete semester object
        try:
            semester = Semester.objects.get(id=semester_id)
            semester.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Semester.DoesNotExist:
            return Response({"message": "Not found!"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)


# Create course
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):
    if request.method == 'POST':
        data = request.data
        course_code = data.get('course_code', None)
        course_name = data.get('course_name', None)

        if not course_code:
            return Response({"message": "Course code required!"}, status=status.HTTP_400_BAD_REQUEST)
        if not course_name:
            return Response({"message": "Course name required!"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()
            result_permission_data = {
                "course": course.course_code
            }
            result_permission_serializer = ResultPermissionSerializer(
                data=result_permission_data)
            if result_permission_serializer.is_valid():
                result_permission_serializer.save()
            else:
                course.delete()
                return Response({"message": "Error creating course!"}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"message": "Course already exists!"}, status=status.HTTP_400_BAD_REQUEST)


# Get all courses
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_courses(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Deleting a course


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_course(request, course_id):
    if request.method == 'DELETE':
        course_code = course_id.replace('-', ' ')
        try:
            course = Course.objects.get(course_code=course_code)
            course.delete()
            return Response({"message": "Course deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({"message": "Course not found!"}, status=status.HTTP_404_NOT_FOUND)

# Get all students enrolled in a given course at a given semester


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_course_students(request):
    """
    Get all students enrolled in a given 
    course at a given semester

    Request Data:
        course_code: (str) - Unique code for course object
                    eg. ICS 215, or ICS 215 - Object Oriented Programming
        semester_id: (str) - Unique id for semester object 
                    eg. 2023/2024 - SEM 2
    Response Data:
        (dict): A dictionary in the format
        {
            'course': 'ICS 215 - Object Oriented Programming',
            'semester': '2023/2024 - SEM 2',
            'students': [
                {
                    'student_id': 1,
                    'reg_no': 'E46/6272/2021',
                    'student_name': 'WAMAE JOSEPH NDIRITU',
                    'coursework_marks': null,
                    'exam_marks': null
                }
                ...
            ]
        }
    """
    user = request.user
    course_code = request.data.get('course_code')

    query_params = request.query_params
    search_id = query_params.get('searchId')

    teaching = Teaching.objects.filter(
        lecturer__user__id=user.id, course__course_code=course_code)[0]
    enrollments = Enrollment.objects.filter(
        course_code__course_code=course_code, semester__id=teaching.semester.id)
    is_published = ResultPermission.objects.get(
        course__course_code=course_code).marks_published

    students = []

    if search_id:
        students = [{'student_id': enrollment.student.id, 'enrollment_id': enrollment.id, 'reg_no': enrollment.student.reg_no, 'student_name': enrollment.student.user.full_name,
                     'coursework_marks': enrollment.coursework_marks, 'exam_marks': enrollment.exam_marks, 'grade': enrollment.grade if enrollment.result_permission.marks_published else None} for enrollment in enrollments if enrollment.student.reg_no == search_id]
    else:
        students = [{'student_id': enrollment.student.id, 'enrollment_id': enrollment.id, 'reg_no': enrollment.student.reg_no, 'student_name': enrollment.student.user.full_name,
                     'coursework_marks': enrollment.coursework_marks, 'exam_marks': enrollment.exam_marks, 'grade': enrollment.grade if enrollment.result_permission.marks_published else None} for enrollment in enrollments]

    return Response({'course': course_code, 'students': students, 'published': is_published}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_course_missing_mark_students(request):
    """
    Get all students enrolled in a given 
    course at a given semester

    Request Data:
        course_code: (str) - Unique code for course object
                    eg. ICS 215, or ICS 215 - Object Oriented Programming
        semester_id: (str) - Unique id for semester object 
                    eg. 2023/2024 - SEM 2
    Response Data:
        (dict): A dictionary in the format
        {
            'course': 'ICS 215 - Object Oriented Programming',
            'semester': '2023/2024 - SEM 2',
            'students': [
                {
                    'student_id': 1,
                    'reg_no': 'E46/6272/2021',
                    'student_name': 'WAMAE JOSEPH NDIRITU',
                    'coursework_marks': null,
                    'exam_marks': null
                }
                ...
            ]
        }
    """
    user = request.user
    course_code = request.data.get('course_code')

    query_params = request.query_params

    teaching = Teaching.objects.filter(
        lecturer__user__id=user.id, course__course_code=course_code)[0]

    missing_marks = MissingMarks.objects.filter(
        enrollment__course_code__course_code=course_code, enrollment__semester__id=teaching.semester.id)

    enrollments = [missing_mark.enrollment for missing_mark in missing_marks]
    is_published = ResultPermission.objects.get(
        course__course_code=course_code).marks_published

    students = []
    for enrollment in enrollments:
        # Get the related MissingMarks object for this enrollment
        missing_mark_obj = next(
            (mm for mm in missing_marks if mm.enrollment_id == enrollment.id), None)
        missing_mark_details = {
            "id": missing_mark_obj.id,
            "missing_marks": missing_mark_obj.missing_marks,
            "missing_marks_reason": missing_mark_obj.missing_marks_reason,
            "resolved": missing_mark_obj.resolved,
        } if missing_mark_obj else None

        students.append({
            'student_id': enrollment.student.id,
            'enrollment_id': enrollment.id,
            'reg_no': enrollment.student.reg_no,
            'student_name': enrollment.student.user.full_name,
            'coursework_marks': enrollment.coursework_marks,
            'exam_marks': enrollment.exam_marks,
            'grade': enrollment.grade if enrollment.result_permission.marks_published else None,
            'missing_mark': missing_mark_details
        })

    return Response({'course': course_code, 'students': students, 'published': is_published}, status=status.HTTP_200_OK)

# Lecturer resolve missing marks by updating MissingMark object
@api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
def resolve_missing_mark(request, id):
    """
    Resolve missing marks by updating MissingMark object
    """
    missing_mark = get_object_or_404(MissingMarks, id=id)
    if missing_mark:
        print("Resolving missing mark for enrollment:",
              request.data.get('reason'))
        missing_mark.missing_marks_reason = request.data.get('reason')
        missing_mark.resolved = True
        missing_mark.save()
        # Notify the student about the resolution
        send_missing_mark_report_update(
            missing_mark.enrollment.student.user.email, missing_mark.enrollment.course_code.course_name)
        return Response({"message": "Missing marks resolved successfully!"}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def upload_marks(request):
    """
    Uploads marks in the Enrollment object
    """
    if request.method == 'PATCH':
        enrollments_data = request.data.get('enrollments', [])
        for enrollment_data in enrollments_data:
            # Get the existing Enrollment object
            enrollment_id = enrollment_data.get('enrollment_id')
            enrollment = get_object_or_404(Enrollment, id=enrollment_id)

            # Update only the coursework_marks and exam_marks fields
            serializer = EnrollmentSerializer(
                instance=enrollment,
                data={'coursework_marks': enrollment_data.get('coursework_marks'),
                      'exam_marks': enrollment_data.get('exam_marks')},
                partial=True  # Allow partial updates
            )

            if serializer.is_valid():
                serializer.save()
            else:
                # Handle invalid serializer data
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Marks uploaded successfully"}, status=status.HTTP_200_OK)

# Publish results


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def publish_results(request):
    """
    Compute grades and publish results for enrollments
    """
    if request.method == 'PATCH':
        user = request.user
        course_code = request.data.get('course_code')
        teaching = Teaching.objects.filter(
            lecturer__user__id=user.id, course__course_code=course_code)[0]
        emails = []
        missing_mark_emails = []

        # Retrieve enrollments for the specified course and semester
        enrollments = Enrollment.objects.filter(
            course_code__course_code=course_code, semester__id=teaching.semester.id)

        for enrollment in enrollments:
            if enrollment.coursework_marks and enrollment.exam_marks and enrollment.coursework_marks > 0 and enrollment.exam_marks > 0:
                # Calculate total marks
                total_marks = enrollment.coursework_marks + enrollment.exam_marks

                # Calculate percentage
                percentage = (total_marks / 100) * 100

                # Determine grade based on percentage
                if percentage < 40:
                    grade = 'E'
                elif percentage < 50:
                    grade = 'D'
                elif percentage < 60:
                    grade = 'C'
                elif percentage < 70:
                    grade = 'B'
                else:
                    grade = 'A'

                # Update the enrollment with the calculated grade
                try:
                    enrollment = Enrollment.objects.get(id=enrollment.id)
                    enrollment.grade = grade
                    enrollment.score = total_marks
                    emails.append(enrollment.student.user.email)
                    enrollment.save()

                    # Check if the student has missing marks
                    missing_mark = MissingMarks.objects.get(
                        enrollment=enrollment, missing_marks=True)
                    if missing_mark:
                        missing_mark.resolved = True
                        missing_mark.missing_marks = False
                        missing_mark.save()
                        # Notify the student about the resolution
                        send_missing_mark_report_update(
                            enrollment.student.user.email, enrollment.course_code.course_name)
                except Enrollment.DoesNotExist:
                    pass
            else:
                enrollment.grade = None
                enrollment.score = None
                enrollment.save()
                # Handle missing marks
                missing_mark_emails.append(enrollment.student.user.email)

        result_permission = ResultPermission.objects.get(
            course__course_code=course_code)
        result_permission.marks_published = True
        result_permission.save()
        send_results_notification(emails, result_permission.course.course_name)
        send_missing_results_notification(
            missing_mark_emails, result_permission.course.course_name)
        return Response({"message": "Results has been published successfully! Each student will be notified of the updates via their emails."}, status=status.HTTP_200_OK)


# Get student courses
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_courses(request):
    """
    Get current user courses
    """
    user = request.user
    enrollments = Enrollment.objects.filter(
        student__user__id=user.id)

    # Extract student details from enrollments
    courses = [{'enrollment_id': enrollment.id, 'course_code': enrollment.course_code.course_code, 'course_name': enrollment.course_code.course_name,
                'exam_type': enrollment.exam_type, "semester": enrollment.semester.id} for enrollment in enrollments if enrollment is not None]

    return Response(courses, status=status.HTTP_200_OK)

# Get student courses


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_results(request):
    """
    Get current user courses
    """
    query_params = request.query_params
    search_id = query_params.get('searchId')
    if search_id:
        students = []
        try:
            student = Student.objects.get(reg_no=search_id)
            user = CustomUser.objects.get(id=student.user_id)
            student_serializer = StudentSerializer(student)
            user_serializer = CustomUserSerializer(user)
            student_info = {
                **student_serializer.data,
                **user_serializer.data
            }
            students.append(student_info)
            return Response(students, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"message": "No Student matching the given REG NO!"}, status=status.HTTP_404_NOT_FOUND)
    users_list = []
    user = request.user
    enrollments = Enrollment.objects.filter(
        student__user__id=user.id, result_permission__marks_published=True, grade__isnull=False)

    # Initialize a dictionary to store courses by semester
    courses_by_semester = {}

    # Iterate over the enrollments and organize courses by semester
    for enrollment in enrollments:
        if enrollment is not None and enrollment.result_permission.marks_published:
            semester_id = enrollment.semester.id
            course_details = {
                'enrollment_id': enrollment.id,
                'course_code': enrollment.course_code.course_code,
                'course_name': enrollment.course_code.course_name,
                'coursework_marks': enrollment.coursework_marks,
                'exam_marks': enrollment.exam_marks,
                'score': enrollment.score,
                'grade': enrollment.grade
            }
            # Initialize the semester entry in the dictionary if not present
            if semester_id not in courses_by_semester:
                courses_by_semester[semester_id] = []
            # Add the course details to the dictionary under the semester
            courses_by_semester[semester_id].append(course_details)

    return Response(courses_by_semester, status=status.HTTP_200_OK)

# Enroll student to course


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request):
    """
    Enroll current user to the given courses
    """
    course_data = request.data
    if len(course_data) > 0:
        errors = []
        for obj in course_data:
            course_code = obj.get('course_code')
            try:
                Course.objects.get(course_code=course_code)
            except Course.DoesNotExist:
                return Response({"message": "Invalid course code!"}, status=status.HTTP_404_NOT_FOUND)
            permission = ResultPermission.objects.get(
                course__course_code=course_code)
            student = Student.objects.get(user_id=request.user.id)
            data = {
                'course_code': course_code,
                'semester': obj.get('semester_id'),
                'exam_type': obj.get('exam_type'),
                'student': student.id,
                'result_permission': permission.id
            }
            serializer = EnrollmentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                errors_dict = json.loads(json.dumps(serializer.errors))
                if errors_dict['non_field_errors'][0] == "The fields student, course_code must make a unique set.":
                    errors.append(
                        {"message": f"{course_code} is already registered!"})
                else:
                    errors.append(serializer.errors)
        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Enrolled successfully'}, status=status.HTTP_201_CREATED)

# Get student missing results


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_missing_results(request):
    """
    Get current user courses whose marks published but with no marks
    """
    user = request.user
    enrollments = Enrollment.objects.filter(
        student__user__id=user.id, result_permission__marks_published=True, grade=None)

    # Extract student details from enrollments
    courses = [{'enrollment_id': enrollment.id, 'course_code': enrollment.course_code.course_code, 'course_name': enrollment.course_code.course_name,
                'exam_type': enrollment.exam_type, "semester": enrollment.semester.id} for enrollment in enrollments if enrollment is not None]

    return Response(courses, status=status.HTTP_200_OK)

# Student report missing results


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_missing_results(request):
    """
    Report missing results for a course
    """
    if request.method == 'POST':
        user = request.user
        enrollment_id = request.data.get('enrollment_id')
        enrollment = get_object_or_404(Enrollment, id=enrollment_id)
        if enrollment:
            # Prevent duplicate reports for the same enrollment
            if MissingMarks.objects.filter(enrollment=enrollment).exists():
                return Response({"message": "Missing marks for this enrollment have already been reported!"}, status=status.HTTP_400_BAD_REQUEST)
            MissingMarks.objects.create(
                enrollment=enrollment,
                missing_marks=True,
                missing_marks_reason=request.data.get('missing_marks_reason')
            )
            teaching = get_object_or_404(
                Teaching, course_id=enrollment.course_code.course_code)
            send_missing_mark_notification_to_lecturer(
                teaching.lecturer.user.email, f"{enrollment.course_code.course_code} - {enrollment.course_code.course_name}")
            return Response({"message": "Missing marks reported successfully!"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Enrollment not found!"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)

# Get user reported missing results


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_reported_missing_results(request):
    """
    Get current user reported missing results
    """
    user = request.user

    reported_missing_results = MissingMarks.objects.filter(
        enrollment__student__user__id=user.id)

    # Extract student details from enrollments
    missing_results = [{'reason': report.missing_marks_reason, 'is_resolved': report.resolved, 'enrollment_id': report.enrollment.id, 'course_code': report.enrollment.course_code.course_code,
                        'course_name': report.enrollment.course_code.course_name, 'exam_type': report.enrollment.exam_type, "semester": report.enrollment.semester.id} for report in reported_missing_results if report is not None]

    return Response(missing_results, status=status.HTTP_200_OK)

# Get perfomance stats


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_perfomance_stats(request):
    """
    Gets current user perfomance stats 
    """
    # Get the current user
    user = request.user

    # Filter enrollments
    enrollments = Enrollment.objects.filter(
        student__user=user, result_permission__marks_published=True
    )

    # Count the number of grades
    grade_counts = enrollments.values('grade').annotate(count=Count('grade'))

    # Define the grade scale
    grade_scale = ["A", "B", "C", "D", "E"]

    # Initialize a dictionary to store grade counts
    grade_counts_dict = {grade: 0 for grade in grade_scale}
    for grade_count in grade_counts:
        grade_counts_dict[grade_count['grade']] = grade_count['count']

    # Determine positive/negative counts
    positive_grades = ["A", "B"]
    negative_grades = ["D", "E"]

    # Analyze the counts
    analysis = {}
    for grade in grade_scale:
        count = grade_counts_dict[grade]
        if grade in positive_grades:
            analysis[grade] = "Positive" if count > 5 else "Negative"
        elif grade in negative_grades:
            analysis[grade] = "Positive" if count < 3 else "Negative"
        else:
            analysis[grade] = "Neutral"

    semester_averages = enrollments.values(
        'semester').annotate(avg_score=Avg('score'))

    # Prepare response data
    data = {
        "grade_counts": grade_counts_dict,
        "analysis": analysis,
        "semester_averages": list(semester_averages)
    }

    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_course_perfomance_stats(request):
    """
    Gets course perfomance stats 
    """
    course_code = request.data.get('course_code')
    semester_id = request.data.get('semester_id')
    enrollments = Enrollment.objects.filter(
        course_code__course_code=course_code, semester_id=semester_id)

    # Count occurrences of each grade
    grade_stats = enrollments.values('grade').annotate(count=Count('grade'))

    return Response(grade_stats, status=status.HTTP_200_OK)


# Get Lecturers teachings
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lecturer_courses(request):
    """
    Get Lecturer's courses
    """
    if request.method == 'GET':
        user = request.user
        teachings = Teaching.objects.filter(lecturer__user__id=user.id)
        courses = [{'teaching_id': teaching.id, 'course_code': teaching.course.course_code,
                    'course_name': teaching.course.course_name, 'semester': teaching.semester.id} for teaching in teachings]
        return Response(courses, status=status.HTTP_200_OK)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)

# Get course lecturers


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_courses_lecturers(request):
    """
    Get all courses lecturers
    """
    if request.method == 'GET':
        teachings = Teaching.objects.all()
        courses = [{'teaching_id': teaching.id, 'course_code': teaching.course.course_code, 'course_name': teaching.course.course_name,
                    'semester': teaching.semester.id, 'full_name': teaching.lecturer.user.full_name, 'lecturer_id': teaching.lecturer.id} for teaching in teachings]
        return Response(courses, status=status.HTTP_200_OK)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)

# Admin assign lecturer courses


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def allocate_lecturer_course(request, lecturer_id):
    """
    Admin assigns a course to a lecturer for a specific semester.
    """
    # Check for POST request
    if request.method != 'POST':
        return Response({"message": "Invalid request method!"}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve data from request
    course_code = request.data.get('course_code')
    semester_id = request.data.get('semester_id')

    # Validate that both course_code and semester_id are provided
    if not course_code or not semester_id:
        return Response({'message': 'Both course_code and semester_id must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Retrieve lecturer, course, and semester objects
        lecturer = Lecturer.objects.get(id=lecturer_id)
        course = Course.objects.get(course_code=course_code)
        semester = Semester.objects.get(id=semester_id)

        # Check if the course is already assigned to the lecturer in the semester
        if Teaching.objects.filter(lecturer=lecturer, course=course, semester=semester).exists():
            return Response({'message': 'This course is already assigned to the lecturer in the selected semester.'}, status=status.HTTP_400_BAD_REQUEST)

        # Assign the course to the lecturer for the semester
        teaching = Teaching.objects.create(
            lecturer=lecturer, course=course, semester=semester)

        return Response({'message': f'Course {course_code} assigned to lecturer {lecturer_id} for semester {semester_id}.'}, status=status.HTTP_201_CREATED)

    except Lecturer.DoesNotExist:
        return Response({'message': 'Lecturer not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Course.DoesNotExist:
        return Response({'message': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Semester.DoesNotExist:
        return Response({'message': 'Semester not found.'}, status=status.HTTP_404_NOT_FOUND)
    except IntegrityError:
        # Catch unique constraint violations or other database integrity errors
        return Response({'message': 'This course is already assigned to another lecturer in the selected semester.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Generic exception handling for unexpected errors
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Admin get lecturer courses
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_lecturer_courses(request, lecturer_id):
    if request.method == 'GET':
        teachings = Teaching.objects.filter(lecturer__id=lecturer_id)
        courses = [{"teaching_id": teaching.id, "course_code": teaching.course.course_code,
                    "course_name": teaching.course.course_name, "semester": teaching.semester.id, "year": teaching.course.level} for teaching in teachings]
        return Response(courses, status=status.HTTP_200_OK)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_403_BAD_REQUEST)

# Admin get lecturer details


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_lecturer_details(request, lecturer_id):
    if request.method == 'GET':
        try:
            lecturer = Lecturer.objects.get(id=lecturer_id)
            info = {
                "full_name": lecturer.user.full_name,
                "email": lecturer.user.email,
                "contact": lecturer.user.contact
            }
            return Response(info, status=status.HTTP_200_OK)
        except Lecturer.DoesNotExist:
            return Response({"message": "Lecturer not found!"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"message": "Invalid request method!"}, status=status.HTTP_403_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    """
    Users stats
    """
    total_students = Student.objects.count()
    total_lectures = Lecturer.objects.count()
    total_courses = Course.objects.count()
    return Response({"students_count": total_students, "lecturers_count": total_lectures, "courses_count": total_courses}, status=status.HTTP_200_OK)

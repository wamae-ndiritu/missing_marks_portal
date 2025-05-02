from django.urls import path
from .views import add_students, delete_user, login, get_students, create_course, get_courses, delete_course, semester_view, get_course_students, enroll_course, get_student_courses, upload_marks, publish_results, get_perfomance_stats, get_course_perfomance_stats, update_profile, add_lecturers, get_lecturers, allocate_lecturer_course, get_lecturer_courses, get_courses_lecturers, admin_get_lecturer_courses, admin_get_lecturer_details, get_stats, get_student_results

urlpatterns = [
    path('stats/', get_stats),
    path('users/add/students/', add_students),
    path('users/students/', get_students),
    path('users/<int:user_id>/delete/', delete_user),
    path('users/login/', login),
    path('users/update/', update_profile),
    path('users/add/lecturers/', add_lecturers),
    path('users/lecturers/', get_lecturers),
    path('users/lecturers/<int:lecturer_id>/', admin_get_lecturer_details),
    path('users/lecturer/courses/', get_lecturer_courses),
    path('users/lecturers/<int:lecturer_id>/courses/enroll/', allocate_lecturer_course),
    path('users/lecturers/<int:lecturer_id>/courses/', admin_get_lecturer_courses),
    path('courses/create/', create_course),
    path('courses/', get_courses),
    path('courses/lecturers/', get_courses_lecturers),
    path('courses/<str:course_id>/delete/', delete_course),
    path('courses/students/', get_course_students),
    path('courses/enroll/', enroll_course),
    path('courses/enrolled/', get_student_courses),
    path('courses/enrolled/results/', get_student_results),
    path('courses/results/upload/', upload_marks),
    path('courses/results/stats/', get_perfomance_stats),
    path('courses/stats/', get_course_perfomance_stats),
    path('courses/results/publish/', publish_results),
    path('semesters/create/', semester_view),
    path('semesters/', semester_view),
    path('semesters/<int:semester_id>/', semester_view),
    path('semesters/<int:semester_id>/delete/', semester_view)
]
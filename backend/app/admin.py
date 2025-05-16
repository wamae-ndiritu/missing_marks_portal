from django.contrib import admin
from .models import Admin, Student, Lecturer, Course, Semester, ResultPermission, Enrollment, CustomUser, Teaching, MissingMarks

admin.site.register(CustomUser)
admin.site.register(Teaching)
admin.site.register(Admin)
admin.site.register(Student)
admin.site.register(Lecturer)
admin.site.register(Course)
admin.site.register(Semester)
admin.site.register(ResultPermission)
admin.site.register(Enrollment)
admin.site.register(MissingMarks)

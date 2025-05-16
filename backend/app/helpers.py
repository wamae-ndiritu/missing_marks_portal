import random
import string
from django.core.mail import send_mail


def generate_random_password(length=8):
    """Generate a random password."""
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))


def send_password_email(email, password):
    """Send password to the lecturer's email."""
    subject = 'Initial Student Missing Marks System Login Credentials'
    message = f"You have been added as a Lecturer in the Missing Marks System Portal. Use the email: {email} and password: {password} as your initial login credential for spms. Please don't forget to change this password."
    from_email = ''
    send_mail(subject, message, from_email, [email])


def send_results_notification(emailList, course_name):
    """Notify students when there are Updates on Results."""
    subject = 'Results Updates'
    message = f"{course_name} results has been updated. Please check the changes on your student's portal."
    from_email = ''
    send_mail(subject, message, from_email, emailList)


def send_missing_results_notification(emailList, course_name):
    """Notify students when there are Updates on Results."""
    subject = 'Missing Mark Update'
    message = f"{course_name} results has been updated. Note that you have not been assigned any marks for this course. Contact your lecturer for more information."
    from_email = ''
    send_mail(subject, message, from_email, emailList)


def send_missing_mark_notification_to_lecturer(email, course_name):
    """
    Send missing mark update
    """
    subject = 'New Missing Marks Report'
    message = f"A new missing mark for the {course_name} has been created. Please resolve it by checking on your portal."
    from_email = ''
    send_mail(subject, message, from_email, [email])


def send_missing_mark_report_update(email, course_name):
    """
    Send missing mark update
    """
    subject = 'Missing Mark Updates'
    message = f"Your missing marks for the course {course_name} has been updated. Please check the changes on your student's portal."
    from_email = ''
    send_mail(subject, message, from_email, [email])

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth.hashers import make_password


#
class WhatsAppMessage(models.Model):
    phone_id = models.CharField(max_length=255)
    profile_name = models.CharField(max_length=255)
    whatsapp_id = models.CharField(max_length=255)
    from_id = models.CharField(max_length=255)
    message_id = models.CharField(max_length=255)
    timestamp = models.CharField(max_length=255)
    text = models.TextField()
    phone_number = models.CharField(max_length=255)
    message_text = models.TextField()
    message_text_sent_by = models.TextField()
    msg_status_code = models.TextField()
    upload_media_path = models.TextField(default=None, null=True)
    fb_media_id = models.TextField(default=None, null=True)
    msg_status_comment = models.TextField(default=None, null=True)
    admin_seen_count = models.IntegerField(default=0, null=True)
    is_template = models.IntegerField(default=0, null=True)
    template_name = models.TextField(default=None, null=True)
    template_json = models.TextField(default=None, null=True)
    wp_template_json = models.TextField(default=None, null=True)
    whatsapp_bussiness_number = models.TextField(default=None, null=True)



class User(AbstractUser):
    # your existing fields here

    def save(self, *args, **kwargs):
        # Check if the password is set and not already hashed
        if self.password and not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$', 'argon2')):
            # Hash the password
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

# Add or change the related_name for groups and user_permissions
User._meta.get_field('groups').remote_field.related_name = 'business_user'
User._meta.get_field('user_permissions').remote_field.related_name = 'business_user_permissions'
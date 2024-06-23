from django.contrib import admin

# Register your models here.
from .models import WhatsAppMessage, User
# from .models import Room

admin.site.register(WhatsAppMessage)
admin.site.register(User)
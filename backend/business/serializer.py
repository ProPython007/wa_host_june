from rest_framework import serializers
from .models import *
from .models import WhatsAppMessage, User

#
class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppMessage
        fields = ["phone_id" , "whatsapp_id" , "from_id" , "timestamp" , "profile_name", "phone_number" , "text", "message_text_sent_by", "msg_status_code", "upload_media_path", "fb_media_id", "admin_seen_count"]


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

#
urlpatterns = [
path('', views.home, name = 'home'),
path('d7d01950-d4fb-4190-bef8-2465736065ca', views.whatsAppWebhook, name = 'whatsapp-webhook'),
path('upload_media/', views.upload_image, name = 'whatsapp-webhook-media-upload'),
path('upload_media_document/', views.upload_document, name = 'whatsapp-webhook-media-upload-document'),
path('upload_media_video/', views.upload_video, name = 'whatsapp-webhook-media-upload-video'),
path('update_msg_seen', views.mark_msg_seen_by_admin, name = 'whatsapp-webhook-msg-seen-update'),
path('wp-send-template-api-for-website/', views.send_rest_template, name = 'wp-send-template-api-for-website'),
path('login/',views.UserLoginView.as_view(), name='user-login'),
path('users/', views.UserListView.as_view(), name='user-list'),
path('testboto/', views.FileUploadView, name='testboto'),


path('fetch_mails/<str:q_email>', views.fetch_inbox, name='fetch_mails'),
path('reply_mail/', views.reply_mail, name='reply_mail'),
path('reply_mail_alone/', views.reply_mail_standalone, name='reply_mail_standalone'),

path('get_last_mail/<str:user_phnum>', views.get_last_mail, name='get_last_mail'),
path('set_last_mail/', views.set_last_mail, name='set_last_mail'),

# path('send_rest_template', views., name = 'whatsapp-webhook-msg-seen-update'),


]

# Add this line to serve static files during development
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

"""
URL configuration for max_app_prooj project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import business
# from django.conf.urls import url
from business.views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('business.urls')),
    path('api/react/<int:id>', ReactView.as_view(), name="anything"),
    path('api/react/', ReactView.as_view(), name="anything_no_id"),
    path('api/react_rooms/', ReactView_rooms.as_view(), name="rooms"),
    path('api/react_rooms2/', ReactView_rooms2.as_view(), name="rooms"),
    path('api/react_rooms_sendmsg/', send_message, name="rooms_send_msg"),
    path('api/react/v2/<int:id>/<int:whatsapp_bussiness_number>/', ReactViewv2.as_view(), name="your_view_name"),
]


# Add this line to serve static files during development
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
from django.conf import settings
from django.contrib.auth import authenticate, login , get_user_model
from django.core.cache import cache
from django.db.models import Max, OuterRef, Subquery , Count , Q
from django.db.models import Subquery, OuterRef, Max, F, RowRange, Window
from django.db.models.functions import RowNumber
from django.http import HttpResponse , JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from .functions import *
from .serializer import *
from .models import *
# from business.custom_storages import CustomS3Boto3Storage
import json
import traceback
import requests
import os
import sys
from datetime import datetime
import time
from urllib.parse import unquote

from imap_tools import MailBox, AND, H
import base64

from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import smtplib



# LOGIN
# =============================================

def check_user_exists(email):
    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(email=email)
        return True
    except UserModel.DoesNotExist:
        return False

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email, password)
        print(check_user_exists(email))
         # Check if the user exists
        # if check_user_exists(email):
        #     # User exists, but don't authenticate
        #     return Response({'user_exists': True}, status=status.HTTP_200_OK)
        # else:
        #     # User does not exist
        #     return Response({'user_exists': False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, email=email, password=password)
        print(user)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'authenticated': True, 'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'authenticated': False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserListView(APIView):
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

def upload_parser_media(request):
    try:
        print("uploading")
        print(request.data.get("media_type"))
        media = request.FILES.get('media')  # Access file data using request.FILES
        upload_dir = os.path.join('business', 'uploads', request.data.get("media_type"))

        # Ensure the directory exists
        os.makedirs(upload_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M")
        unique_filename = f"{timestamp}_{media.name}"
        media_path = os.path.join(upload_dir, unique_filename)
        with open(media_path, 'wb') as file:
            file.write(media.read())
        print("uploaded")
        print(media_path)
        return media_path  # Return the path to the uploaded file
    except Exception as e:
        print(e)
        return None






class ReactView_rooms(APIView):
    def get(self, request):
        try:
            # Get the most recent timestamp for each phone number
            subquery = WhatsAppMessage.objects.filter(
                phone_number=OuterRef('phone_number')
            ).values('phone_number').annotate(
                max_timestamp=Max('timestamp')
            ).values('max_timestamp')
            # recent_messages = subquery.order_by('-max_timestamp')
            # Query to get the most recent messages
            recent_messages = WhatsAppMessage.objects.filter(
                timestamp=Subquery(subquery)
            ).values('profile_name','text', "phone_number", "timestamp", "admin_seen_count", "message_text_sent_by", "msg_status_code","whatsapp_bussiness_number").order_by('timestamp')
            message_counts = WhatsAppMessage.objects.values('phone_number').annotate(message_count=Count('id'))
            recent_messages_with_count = []
            admin_unseen_message_counts = WhatsAppMessage.objects.values('phone_number').annotate(admin_unseen_count=Count('id', filter=Q(admin_seen_count=False) | Q(admin_seen_count=0)))


            # Combine the message counts with the recent messages
            recent_messages_with_count = []
            for message in recent_messages:
                phone_number = message['phone_number']
                total_message_count = next((item['message_count'] for item in message_counts if item['phone_number'] == phone_number), 0)
                admin_unseen_count = next((item['admin_unseen_count'] for item in admin_unseen_message_counts if item['phone_number'] == phone_number), 0)
                message['message_count'] = total_message_count
                message['admin_unseen_count'] = admin_unseen_count
                recent_messages_with_count.append(message)


            # print(recent_messages)
             # Encode text and handle non-ASCII characters
            for message in recent_messages:
                message['text'] = message['text'].encode(sys.stdout.encoding, errors='replace').decode()

            # Use the subquery to retrieve the corresponding rows with the most recent timestamps
            # unique_phone_numbers = WhatsAppMessage.objects.filter(
            #     phone_number=OuterRef('phone_number'),
            #     timestamp=OuterRef('timestamp')
            # ).values('phone_number').order_by('-timestamp')

            return Response(recent_messages)
        except WhatsAppMessage.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)
        









class ReactView_rooms2(APIView):
    @method_decorator(cache_page(30)) 
    def get(self, request):
        try:
            cache_key = 'recent_messages_cache_key'
            cached_data = cache.get(cache_key)

            if cached_data:
                recent_messages = cached_data
            else:
                # Subquery to get the most recent timestamp for each phone number and business number
                subquery = WhatsAppMessage.objects.filter(
                    phone_number=OuterRef('phone_number'),
                    whatsapp_bussiness_number=OuterRef('whatsapp_bussiness_number')
                ).values('phone_number').annotate(
                    max_timestamp=Max('timestamp')
                ).values('max_timestamp')
                # recent_messages = subquery.order_by('-max_timestamp')
                # Query to get the most recent messages
                recent_messages = WhatsAppMessage.objects.filter(
                    timestamp=Subquery(subquery)
                ).values('profile_name','text', "phone_number", "timestamp", "admin_seen_count", "message_text_sent_by", "msg_status_code", "whatsapp_bussiness_number", "whatsapp_bussiness_number").order_by('-timestamp')
                message_counts = WhatsAppMessage.objects.values('phone_number', 'whatsapp_bussiness_number').annotate(message_count=Count('id'))
                # print(message_counts)
                admin_unseen_message_counts = WhatsAppMessage.objects.values('phone_number').annotate(admin_unseen_count=Count('id', filter=Q(admin_seen_count=False) | Q(admin_seen_count=0)))
                # Encode text and handle non-ASCII characters
                for message in recent_messages:
                    # print(message['whatsapp_bussiness_number'])
                    phone_number = message['phone_number']
                    wba = message["whatsapp_bussiness_number"]
                    total_message_count = next((item['message_count'] for item in message_counts if item['phone_number'] == phone_number and item['whatsapp_bussiness_number'] == wba ), 0)
                    admin_unseen_count = next((item['admin_unseen_count'] for item in admin_unseen_message_counts if item['phone_number'] == phone_number), 0)
                    # print(phone_number,total_message_count, admin_unseen_count)
                    # print(message)
                    message['text'] = message['text'].encode(sys.stdout.encoding, errors='replace').decode()
                    message['admin_seen_count'] = admin_unseen_count
                    message['admin_unseen_count'] = admin_unseen_count
                cache.set(cache_key, recent_messages, 60 * 15)
            # return Response(recent_messages)
            response_data = {
                'recent_messages': recent_messages,
                'cached': cached_data is not None  # Flag to indicate if response is from cache
            }
            return Response(response_data)
        except WhatsAppMessage.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)






class ReactView(APIView):
    def get(self, request, id=None):
        if id is not None:
            # print(id)
            # An 'id' is provided, fetch and display the specific item
            try:
                items = WhatsAppMessage.objects.filter(phone_number=id).order_by('-timestamp')
                fields = ["phone_id", "whatsapp_id", "from_id", "timestamp", "profile_name", "phone_number", "text","message_text_sent_by", "msg_status_code", "upload_media_path" , "fb_media_id", "msg_status_comment", "admin_seen_count", "message_id", "wp_template_json", "template_json", "is_template", "template_name", "whatsapp_bussiness_number"]
                data = [
                    {field: getattr(item, field) for field in fields}
                    for item in items
                ]
                return Response(data)
            except WhatsAppMessage.DoesNotExist:
                return Response({"error": "Item not found"}, status=404)
        else:
            # No 'id' is provided, display all items
            queryset = WhatsAppMessage.objects.all()
            output = [{"profile_name": item.profile_name, "phone_number": item.phone_number} for item in queryset]
            return Response(output)



class ReactViewv2(APIView):
    def get(self, request, id=None, whatsapp_bussiness_number = None):
        if id is not None:
            # print(id)
            # An 'id' is provided, fetch and display the specific item
            try:
                items = WhatsAppMessage.objects.filter(Q(phone_number=id) & Q(whatsapp_bussiness_number=whatsapp_bussiness_number)).order_by('-timestamp')
                fields = ["phone_id", "whatsapp_id", "from_id", "timestamp", "profile_name", "phone_number", "text","message_text_sent_by", "msg_status_code", "upload_media_path" , "fb_media_id", "msg_status_comment", "admin_seen_count", "message_id", "wp_template_json", "template_json", "is_template", "template_name","whatsapp_bussiness_number"]
                data = [
                    {field: getattr(item, field) for field in fields}
                    for item in items
                ]
                return Response(data)
            except WhatsAppMessage.DoesNotExist:
                return Response({"error": "Item not found"}, status=404)
        else:
            # No 'id' is provided, display all items
            queryset = WhatsAppMessage.objects.all()
            output = [{"profile_name": item.profile_name, "phone_number": item.phone_number} for item in queryset]
            return Response(output)




# Create your views here.
def home(request):
    # return HttpResponse("Hellaao Worldasas2")
    return render(request, "business/index.html")
def chatroom_page(request):
    # return HttpResponse("Hellaao Worldasas2")
    return render(request, "business/chatroom_web/index.html")

@csrf_exempt
def send_message(request):
    if request.method == 'POST':
        # Get data from the request and load it as JSONP
        # data = json.loads(request.body.decode('utf-8'))
        # data = json.loads(request.body.decode('utf-8'), object_hook=lambda d: {k: v.encode('latin-1').decode('utf-8') if isinstance(v, str) else v for k, v in d.items()})
        data = json.loads(request.body.decode('utf-8'), object_hook=lambda d: d) 
        # print(data)
        
        # Extract the data from the JSON
        phone_id = data.get("from_number")
        profile_name = data.get("profile_name", "no name")
        whatsapp_id = ""
        from_id = data.get("from_number")
        timestamp = time.time()
        text = data.get("message_text")
        phone_number = data.get("phone_number")
        message_text = data.get("message_text")
        message_status = "sent"
        msg_sent_by = "DJANGO ADMIN"

        
        # Send the message using your sendWhatsAppMessage function
        res_wp_msg_id = sendWhatsAppMessage(phone_number,message_text, phone_id)  # Assuming sendWhatsAppMessage returns a message ID
        message_id = res_wp_msg_id
        
        # Create a WhatsAppMessage instance and save it to the database
        WhatsAppMessage.objects.create(
            phone_id=phone_id,
            profile_name=profile_name,
            whatsapp_id=whatsapp_id,
            from_id=from_id,
            message_id=message_id,
            timestamp=timestamp,
            text=text,
            phone_number=phone_number,
            message_text=message_text,
            message_text_sent_by = msg_sent_by,
            msg_status_code = message_status,
            admin_seen_count =  1,
            whatsapp_bussiness_number = data.get("from_number")
        )
        
        # Return a success response or handle any errors as needed
        return HttpResponse("Message sent and saved successfully")
        
    else:
        return JsonResponse({'message': 'Invalid data received.'}, status=200)


@csrf_exempt
def whatsAppWebhook(request):
    if request.method == 'GET':
        # print(request.GET)  # Debugging line to check request.GET contents
        VERIFY_TOKEN = "a36563b3-800a-43ec-ad4a-7043005b488c"
        mode = request.GET.get('hub.mode', '')
        token = request.GET.get('hub.verify_token', '')
        challenge = request.GET.get('hub.challenge', '')
        # sendWhatsAppMessage("9956929372", "get auisas")

        if mode == 'subscribe' and token == VERIFY_TOKEN:
            return HttpResponse(challenge, status=200)
        else:   
            return HttpResponse('error', status=403)

    if request.method == 'POST':
        print("data recvd")
        cache_key = 'recent_messages_cache_key'
        cache.delete(cache_key)
        # data = json.loads(request.body)
        target_directory = os.path.join(settings.BASE_DIR, 'static', 'your_target_directory')

        # Ensure the target directory exists, creating it if necessary
        os.makedirs(target_directory, exist_ok=True)

        # Define the target file path
        target_file_path = os.path.join(target_directory, 'your_filename.txt')

        # Copy or move the source data to the target file
        # with open(target_file_path, 'ab') as target_file:
        #     target_file.write(request.body)

        data = json.loads(request.body)

    #    if 'object' in data and 'entry' in data:
        if data['object'] == 'whatsapp_business_account':
            try: 
                token =  settings.WHATSAPP_TOKEN.replace("Bearer ", "")
                # Default primary key field type
                messenger = WhatsApp(token , "128538200341271")
                message_type = messenger.get_message_type(data)
                print(message_type)
                if message_type:
                    if not message_type == "text":
                        print("porocess it")
                        parse_recd_media_msgs(data)
                contacts = data.get("entry", [])[0].get("changes", [])[0].get("value", {}).get("contacts")
                if contacts:
                    process_msg_rec(data)
                else:
                    process_msg_status(data)

            except Exception as e:
                print(e)
                pass
                # Handle exceptions here

        return HttpResponse('success', status=200)



@api_view(['POST'])
def upload_image(request):
    image = request.data.get('image')
    profile_name = request.data.get('profile_name')
    phone_number = request.data.get('phone_number')
    from_number = request.data.get('from_number')
    print(image)
    print(request.data)
    
    if not image:
        return Response({'error': 'No image data received'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Define the directory where you want to save the uploaded images within the static folder
    upload_dir = os.path.join('business', 'uploads', 'images')

    # Ensure the directory exists
    print(upload_dir)
    os.makedirs(upload_dir, exist_ok=True)

    try:
        image_path = os.path.join(upload_dir, image.name)
        current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
        image_name_prefix = f"{current_time}_"

        with open(image_path, 'wb') as file:
            file.write(image.read())

        # Upload the image to S3
        s3_key = f"sent/images/{image_name_prefix}"
        print(s3_key)
        s3_file_url = upload_file_to_s3(image_path, s3_key)


        
        send_and_upload_image(image_path,s3_file_url,profile_name,phone_number,from_number )
        # You can now process the uploaded image, e.g., save the path to a database or perform other operations
        # Delete the local file after uploading to S3
        os.remove(image_path)

        return Response({'message': 'Image uploaded successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_document(request):
    document = request.data.get('document')
    profile_name = request.data.get('profile_name')
    phone_number = request.data.get('phone_number')
    from_number = request.data.get('from_number')
    print(request.data)
    
    if not document:
        return Response({'error': 'No document data received'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Define the directory where you want to save the uploaded documents within the static folder
    upload_dir = os.path.join('business', 'uploads', 'document')

    # Ensure the directory exists
    print(upload_dir)
    os.makedirs(upload_dir, exist_ok=True)

    try:
        doc_path = os.path.join(upload_dir, document.name)

        with open(doc_path, 'wb') as file:
            file.write(document.read())
        
        current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
        doc_name_prefix = f"{current_time}"
        # Upload the image to S3
        s3_key = f"sent/docs/{doc_name_prefix}_"
        s3_file_url = upload_file_to_s3(doc_path, s3_key)

        send_and_upload_document(doc_path,s3_file_url,profile_name,phone_number,from_number)
        # You can now process the uploaded image, e.g., save the path to a database or perform other operations

        # Delete the local file after uploading to S3
        os.remove(doc_path)

        return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_video(request):
    document = request.data.get('video')
    profile_name = request.data.get('profile_name')
    phone_number = request.data.get('phone_number')
    from_number = request.data.get('from_number')
    # print(document)
    print(request.data)
    
    if not document:
        return Response({'error': 'No document data received'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Define the directory where you want to save the uploaded documents within the static folder
    upload_dir = os.path.join('business', 'uploads', 'video')

    # Ensure the directory exists
    print(upload_dir)
    os.makedirs(upload_dir, exist_ok=True)

    try:
        doc_path = os.path.join(upload_dir, document.name)

        with open(doc_path, 'wb') as file:
            file.write(document.read())
        current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
        video_name_prefix = f"{current_time}_"
        s3_key = f"sent/videos/{video_name_prefix}"
        print(s3_key)
        s3_file_url = upload_file_to_s3(doc_path, s3_key)
        
        send_and_upload_video(doc_path,s3_file_url,profile_name,phone_number,from_number)
        # You can now process the uploaded image, e.g., save the path to a database or perform other operations

        os.remove(doc_path)
        return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(['POST'])
def mark_msg_seen_by_admin(request):
    try:
        data = json.loads(request.body)
        mark_msg_seen_by_admin_func(data)
        return  Response({'message': 'msg updated'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def send_rest_template(request):
    try:
        content_type = request.content_type
        print(content_type)
        if request.content_type.startswith('multipart/form-data'):
            # Use request.POST for form data
            data = request.POST.dict()
            # data = request.data
            print("=======================================================")
            print(data)
            print(data.get("components"))
            print(request.POST.getlist("components"))
            components = request.POST.getlist("components")

            # Add components to the data dictionary
            data["components"] = components
            print("=======================================================")
        else:
            # Assume JSON if not multipart/form-data
            data = json.loads(request.body.decode('utf-8'))
        if data.get("template_name") ==  "abandoned_checkout":
            if len(data.get("components")) == 4:
                send_abandoned_checkout_template(data)
                return  Response({'message': 'msg updated'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': "Please pass all 4 parameters"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data.get("template_name") ==  "cancelled":
            if len(data.get('components')) == 3:
                document = request.data.get('video')    
                if not document:
                    return Response({'error': 'No document data received'}, status=status.HTTP_400_BAD_REQUEST)
    
                # Define the directory where you want to save the uploaded documents within the static folder
                upload_dir = os.path.join('business', 'uploads', 'video')

                # Ensure the directory exists
                print(upload_dir)
                os.makedirs(upload_dir, exist_ok=True)

                try:
                    timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M")
                    unique_filename = f"{timestamp}_{document.name}"
                    doc_path = os.path.join(upload_dir, unique_filename)
                    # doc_path = ""

                    with open(doc_path, 'wb') as file:
                        file.write(document.read())

                    current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                    video_name_prefix = f"{current_time}_"                    
                    s3_key = f"sent/video/{video_name_prefix}"
                    print(s3_key)
                    s3_file_url = upload_file_to_s3(doc_path, s3_key)

                    send_cancelled_template(doc_path,s3_file_url, data)
                    os.remove(doc_path)
                    # You can now process the uploaded image, e.g., save the path to a database or perform other operations

                    return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e), "data" : data}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'error': "Please pass all 3 parameters"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data.get("template_name") ==  "business_chat_start_normaltext":
            print(data)
            if len(data.get("components")) == 1:
                send_business_chat_start_normaltext(data)
                return Response({'message': 'msg updated'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': "Please pass all  parameters"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data.get("template_name") ==  "business_start_chat_realtext":
            if len(data.get("components")) == 1:
                send_business_start_chat_realtext(data)
                return Response({'message': 'msg updated'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': "Please pass all  parameters"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data.get("template_name") == "business_chat_start_document":
            # print(data)
            media_path = upload_parser_media(request)
            print(media_path)
            if media_path:
                print("uploaded at - ", media_path)
                current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                media_prefix = f"{current_time}_"                    
                s3_key = f"sent/docs/{media_prefix}"
                print(s3_key)
                s3_file_url = upload_file_to_s3(media_path, s3_key)
                send_business_chat_start_document(media_path,s3_file_url, data)
                os.remove(media_path)
                # You can use media_path as needed, e.g., pass it to another function or save it to a database
                return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Error uploading media'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        if data.get("template_name") == "business_start_chat_photo":
            # print("business_start_chat_photo")
            # print(data)
            media_path = upload_parser_media(request)
            if media_path:
                print("uploaded at - ", media_path)
                current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                media_prefix = f"{current_time}_"                    
                s3_key = f"sent/image/{media_prefix}"
                print(s3_key)
                s3_file_url = upload_file_to_s3(media_path, s3_key)
                send_business_start_chat_photo(media_path,s3_file_url, data)
                os.remove(media_path)
                # You can use media_path as needed, e.g., pass it to another function or save it to a database
                return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Error uploading media'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        if data.get("template_name") == "busines_start_chat_text":
            # print("busines_start_chat_text")
            # print(data)
            media_path = upload_parser_media(request)
            if media_path:
                print("uploaded at - ", media_path)
                current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                media_prefix = f"{current_time}_"                    
                s3_key = f"sent/video/{media_prefix}"
                print(s3_key)
                s3_file_url = upload_file_to_s3(media_path, s3_key)
                send_busines_start_chat_text(media_path,s3_file_url, data)
                os.remove(media_path)
                # You can use media_path as needed, e.g., pass it to another function or save it to a database
                return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Error uploading media'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data.get("template_name") == "shipped":
            # print("shipped")
            # print(data)
            if len(data.get('components')) == 8:
                media_path = upload_parser_media(request)
                if media_path:
                    print("uploaded at - ", media_path)
                    current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                    media_prefix = f"{current_time}_"                    
                    s3_key = f"sent/video/{media_prefix}"
                    print(s3_key)
                    s3_file_url = upload_file_to_s3(media_path, s3_key)
                    send_shipped(media_path,s3_file_url, data)
                    os.remove(media_path)
                    # You can use media_path as needed, e.g., pass it to another function or save it to a database
                    return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Error uploading media'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'error': "Please pass all 8 parameters"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data.get("template_name") == "order_confirmation":
            # print("order_confirmation")
            # print(data)
            media_path = upload_parser_media(request)
            if media_path:
                print("uploaded at - ", media_path)
                current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
                media_prefix = f"{current_time}_"
                s3_key = f"sent/video/{media_prefix}"
                print(s3_key)
                s3_file_url = upload_file_to_s3(media_path, s3_key)
                send_order_confirmation(media_path,s3_file_url, data)
                os.remove(media_path)
                # You can use media_path as needed, e.g., pass it to another function or save it to a database
                return Response({'message': 'document uploaded successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Error uploading media'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    except Exception as e:
        error_traceback = traceback.format_exc()
        return Response({'error': f'{str(e)}\n{error_traceback}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   

from django.views import View
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
@api_view(['POST'])
def FileUploadView(request):
    file_obj = request.FILES.get('media')
    if not file_obj:
        return Response({'message': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    username = "max"
    file_directory_within_staticfiles = os.path.join(settings.STATIC_ROOT, 'user_upload_files', username)

    # Ensure the directory exists
    if not os.path.exists(file_directory_within_staticfiles):
        os.makedirs(file_directory_within_staticfiles)

    file_path = os.path.join(file_directory_within_staticfiles, file_obj.name)
    file_storage = FileSystemStorage(location=file_directory_within_staticfiles)

    if not file_storage.exists(file_obj.name):  # avoid overwriting existing file
        file_storage.save(file_obj.name, file_obj)
        file_url = os.path.join(settings.STATIC_URL, 'user_upload_files', username, file_obj.name)
        return JsonResponse({'message': 'OK', 'fileUrl': file_url})

    return Response({'message': 'File already exists'}, status=status.HTTP_409_CONFLICT)



emails_data = {
    'rohinishrim@gmail.com': 'wkgh anfn vwby zgnm',
    'amanshah.rocks3@gmail.com': 'bfbd yotg ulbz ijno',
    'ankit.kumartaah@gmail.com': 'wqds hbrb zssm orvb',
    'mansingh.kr111@gmail.com': 'cjyc frox xtso pqgn',
    'nehacool.kk3@gmail.com': 'eqgq dipu ntyj hjwd',
    'mohanlal.lal1333@gmail.com': 'cvpb ways lhkr qhkr',
    'samirsheikhcool@gmail.com': 'uklc makd kbqv pwou',
    'samirkumar.rocks333@gmail.com': 'cqgp bjxp gphp jslp',
    'rahul.mishra73333@gmail.com': 'mpqo gyhf oxbu fyuv'
}

@api_view(['GET'])
def fetch_inbox(request, q_email):
    mails = []
    q_email_pass = emails_data[q_email]

    mail_server = 'imap.gmail.com'
    mail_folder = '[Gmail]/All Mail'

    with MailBox(mail_server).login(q_email, q_email_pass, mail_folder) as mailbox:
        emails = mailbox.fetch(AND(all=True), reverse=True, limit=20)
        emails = reversed(list(emails))

        email_dict = {}
        for msg in emails:
            if ('in-reply-to' in msg.headers):
                if msg.headers['in-reply-to'][0] in email_dict:
                    email_dict[msg.headers['in-reply-to'][0]].append(msg)
                else:
                    for k, v in email_dict.items():
                        if msg.headers['in-reply-to'][0] in [val.headers['message-id'][0] for val in v]:
                            email_dict[k].append(msg)
                
            else:
                email_dict[msg.headers['message-id'][0]] = [msg]

        for thread_id, msgs in email_dict.items():
            for i, msg in enumerate(msgs):
                if i == 0:
                    email_data = {
                        "thread_id": thread_id,
                        "email_id": msg.uid,
                        "from": msg.from_,
                        "subject": msg.subject,
                        "date": msg.date.strftime('%Y-%m-%d %H:%M:%S'),
                        "to": msg.to,
                        "cc": msg.cc,
                        "bcc": msg.bcc,
                        "body": msg.text or msg.html,
                        "attachments": [{
                            "filename": att.filename,
                            "content_type": att.content_type,
                            "size": att.size,
                            "content": base64.b64encode(att.payload).decode('utf-8')
                        } for att in msg.attachments],
                        "replies": []
                    }
                    mails.append(email_data)
                
                else:
                    mails[-1]["replies"].append(
                        {
                            "thread_id": thread_id,
                            "email_id": msg.uid,
                            "from": msg.from_,
                            "subject": msg.subject,
                            "date": msg.date.strftime('%Y-%m-%d %H:%M:%S'),
                            "to": msg.to,
                            "cc": msg.cc,
                            "bcc": msg.bcc,
                            "body": msg.text or msg.html,
                            "attachments": [{
                                "filename": att.filename,
                                "content_type": att.content_type,
                                "size": att.size,
                                "content": base64.b64encode(att.payload).decode('utf-8')
                            } for att in msg.attachments],
                            "replies": []
                        }
                    )

    mails = mails[::-1]
    return Response(mails)


@api_view(['POST'])
def reply_mail(request):
    response = []
    if request.method == 'POST':
        q_email = request.data.get('selected_mail')
        q_email_pass = emails_data[q_email]
        p_uid = request.data.get('p_uid')
        q_content = request.data.get('mail_body')

        # IMAP configuration
        imap_user = q_email
        imap_pass = q_email_pass
        imap_host = 'imap.gmail.com'
        smtp_host = 'smtp.gmail.com'
        smtp_port = 587
        mail_folder = '[Gmail]/All Mail'

        with MailBox(imap_host).login(imap_user, imap_pass, mail_folder) as mailbox:
            pa_email = mailbox.fetch(AND(uid=p_uid))
            parent_email = next(pa_email)

            target_subject = parent_email.subject
            target_from = parent_email.from_
            target_message_id = parent_email.headers['message-id'][0]

            # print(target_subject, target_from, target_message_id)

            # Create the reply email
            reply = MIMEMultipart()
            reply['Subject'] = f"{target_subject}"
            reply['From'] = imap_user
            reply['To'] = target_from
            reply['in-reply-to'] = target_message_id
            reply['references'] = target_message_id

            body = f"{q_content}"
            reply.attach(MIMEText(body, 'plain'))


            for file_key in request.FILES:
                file = request.FILES[file_key]
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename={file.name}')
                reply.attach(part)

            if q_email.split('@')[-1] == 'gmail.com':
                server = smtplib.SMTP(smtp_host, smtp_port)
                server.starttls()
            else:
                server = smtplib.SMTP_SSL(smtp_host, smtp_port)
            try:
                server.login(imap_user, imap_pass)
                server.sendmail(reply['From'], reply['To'].split(','), reply.as_string())
                response.append({"Message":"Email sent successfully."})
            except Exception as e:
                response.append({"Message":"Failed to send mail."})
            finally:
                server.quit()

    return Response(response)


@api_view(['POST'])
def reply_mail_standalone(request):
    response = []
    if request.method == 'POST':
        q_email = request.data.get('selected_mail')
        q_email_pass = emails_data[q_email]
        
        q_sub = request.data.get('mail_sub')
        q_content = request.data.get('mail_body')
        q_mail = request.data.get('mail_to')
        q_cc = request.data.get('mail_cc')

        # IMAP configuration
        imap_user = q_email
        imap_pass = q_email_pass

        # Create the reply email
        my_mail = MIMEMultipart()
        my_mail['Subject'] = f"{q_sub}"
        my_mail['From'] = imap_user
        my_mail['To'] = q_mail
        my_mail['CC'] = q_cc

        body = f"{q_content}"
        my_mail.attach(MIMEText(body, 'plain'))


        for file_key in request.FILES:
            file = request.FILES[file_key]
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(file.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={file.name}')
            my_mail.attach(part)

        if q_email.split('@')[-1] == 'gmail.com':
            smtp_host = 'smtp.gmail.com'
            smtp_port = 587
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()

        else:
            smtp_host = 'casualfootwears.com'
            smtp_port = 465
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)

        try:
            server.login(imap_user, imap_pass)
            server.sendmail(my_mail['From'], my_mail['To'].split(','), my_mail.as_string())
            response.append({"Message":"Email sent successfully."})
        except Exception as e:
            response.append({"Message":"Failed to send mail."})
        finally:
            server.quit()

    return Response(response)
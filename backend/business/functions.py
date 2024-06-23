from django.conf import settings
import requests
from .models import WhatsAppMessage
from heyoo import WhatsApp
import time
import os
from datetime import datetime
import json
# from business.custom_storages import CustomS3Boto3Storage
# from django.core.files.base import ContentFile
#



# def upload_file_to_s3(file_path, bucket_path):
#     # Open the file as a file-like object
#     with open(file_path, 'rb') as file:
#         file_content = file.read()

#     # file_directory_within_bucket = f'whatsapp_media/{bucket_path}'
#     # file_path_within_bucket = os.path.join(
#     #     file_directory_within_bucket,
#     #     os.path.basename(file_path)  # Use the file name as the object name within the bucket
#     # )
#     filename = os.path.basename(file_path)
#     print(filename)

#     # Use the filename directly as the object name within the bucket
#     file_path_within_bucket = os.path.join(bucket_path, filename)

#     print(file_path_within_bucket)
#     media_storage = CustomS3Boto3Storage()

#     # Save the file content to S3 using a Django ContentFile
#     file_content_obj = ContentFile(file_content)
#     media_storage.save(file_path_within_bucket, file_content_obj)

#     file_url = media_storage.url(file_path_within_bucket)
#     print(file_url)
#     return file_url

def upload_file_to_s3(file_path, static_path):
    # Open the file as a file-like object
    with open(file_path, 'rb') as file:
        file_content = file.read()

    # Use the filename directly as the object name within the static directory
    filename = os.path.basename(file_path)
    print(filename)

    # Create the directory if it doesn't exist
    static_directory = os.path.join(settings.STATIC_ROOT, static_path)
    os.makedirs(static_directory, exist_ok=True)

    # Full file path within static storage
    file_path_within_static = os.path.join(static_path, filename)
    full_file_path = os.path.join(settings.STATIC_ROOT, file_path_within_static)
    print(full_file_path)

    # Save the file content to the static file system
    if not os.path.exists(full_file_path):  # avoid overwriting existing file
        with open(full_file_path, 'wb') as static_file:
            static_file.write(file_content)

    file_url = os.path.join(settings.STATIC_URL, file_path_within_static)
    print(file_url)
    return file_url


def get_meta_template_json(template_name):
    try:
        import requests

        url = f"https://graph.facebook.com/v18.0/120126377855203/message_templates?name={template_name}"

        payload = {}
        headers = {
        'Authorization': 'Bearer EAAUovSpndZBABO6m0npKSC9M9cGGWwZCD1Rlc1OZAWaiLnvldsq1nOM7TLogU4ZBZCZBZBdZAIFSGKIAWIJesotLXQ88P5yZB5P1fTFrZAZCnodPfXfTusY5iH6Hz7WjBDuzZBmLDvZAdPIyWZAmAZCM1HUD5Ky6fwnBkqJcPlI6GwTJbgyMN6NX95bSNQCFSwZA6vWEQsZBX',
        'Cookie': 'ps_l=0; ps_n=0'
        }

        response = requests.request("GET", url, headers=headers, data=payload)

        # print(response.text)
        return response.text

    except:
        return {}

def sendWhatsAppMessage(phoneNumber, message , whatsapp_bussiness_num):
    token =  settings.WHATSAPP_TOKEN.replace("Bearer ", "")
    # Default primary key field type
    messenger = WhatsApp(token , settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    wba_res = messenger.send_message(message,phoneNumber)

    try:
        message_id = wba_res['messages'][0]['id']
        return message_id
    except:
        return "Error in sending"

 # Import the WhatsAppMessage model

# def save_whatsapp_message(phoneId, profileName, whatsAppId, fromId, messageId, timestamp, text, phoneNumber, message, message_text_sent_by, msg_status_code, upload_media_path):
def save_whatsapp_message(phoneId=None, profileName=None, whatsAppId=None, fromId=None, messageId=None, timestamp=None, text=None, phoneNumber=None, message=None, message_text_sent_by=None, msg_status_code=None, upload_media_path=None, whatsapp_bussiness_number = None):

    # Create a new WhatsAppMessage instance and save it to the database
    whatsapp_message = WhatsAppMessage(
        phone_id=phoneId,
        profile_name=profileName,
        whatsapp_id=whatsAppId,
        from_id=fromId,
        message_id=messageId,
        timestamp=timestamp,
        text=text,
        phone_number=phoneNumber,
        message_text=message,
        message_text_sent_by = message_text_sent_by,
        msg_status_code = msg_status_code,
        upload_media_path = upload_media_path,
        whatsapp_bussiness_number = whatsapp_bussiness_number,
    )
    whatsapp_message.save()


def save_whatsapp_message_template(phoneId=None, profileName=None, whatsAppId=None, fromId=None, messageId=None, timestamp=None, text=None, phoneNumber=None, message=None, message_text_sent_by=None, msg_status_code=None, upload_media_path=None, is_template=None, template_json=None, wp_template_json=None,template_name= None, whatsapp_bussiness_number = None):

    # Create a new WhatsAppMessage instance and save it to the database
    whatsapp_message = WhatsAppMessage(
        phone_id=phoneId,
        profile_name=profileName,
        whatsapp_id=whatsAppId,
        from_id=fromId,
        message_id=messageId,
        timestamp=timestamp,
        text=text,
        phone_number=phoneNumber,
        message_text=message,
        message_text_sent_by = message_text_sent_by,
        msg_status_code = msg_status_code,
        upload_media_path = upload_media_path,
        is_template = is_template,
        template_json = template_json,
        wp_template_json = wp_template_json,
        template_name = template_name,
        whatsapp_bussiness_number = whatsapp_bussiness_number 
    )
    whatsapp_message.save()




def send_and_upload_image(file_path,s3_file_url, profile_name, phone_number, whatsapp_bussiness_num):
    token =  settings.WHATSAPP_TOKEN.replace("Bearer ", "")
    # Default primary key field type
    messenger = WhatsApp(token , settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    # status_label.config(text=f"Uploading file")
    try:
        media_id = messenger.upload_media(media=file_path).get("id")
        wp_msg_id = messenger.send_image(
        image=media_id,
        recipient_id=phone_number,
        link=False
        ).get("messages")[0].get("id")
        phone_id = ""
        profile_name = profile_name
        timestamp = time.time()
        text = ""
        message_text = ""
        message_status = "sent"
        msg_sent_by = "DJANGO ADMIN"

        whatsapp_message = WhatsAppMessage(phone_id=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
        profile_name=profile_name,
        whatsapp_id=phone_number,
        from_id=phone_number,
        message_id=wp_msg_id,
        timestamp=timestamp,
        text=text,
        phone_number=phone_number,
        message_text=message_text,
        message_text_sent_by = msg_sent_by,
        msg_status_code = message_status,
        fb_media_id = media_id,
        upload_media_path = s3_file_url,
        whatsapp_bussiness_number = whatsapp_bussiness_num
        )
        whatsapp_message.save()

    except Exception as e:
        print(e)


def send_and_upload_document(file_path, s3_file_url, profile_name, phone_number, whatsapp_bussiness_num):
    token =  settings.WHATSAPP_TOKEN.replace("Bearer ", "")
    # Default primary key field type
    messenger = WhatsApp(token , settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    # status_label.config(text=f"Uploading file")
    try:
        media_id = messenger.upload_media(media=file_path).get("id")
        wp_msg_id = messenger.send_document(
        document=media_id,
        recipient_id=phone_number,
        link=False
        ).get("messages")[0].get("id")
        phone_id = ""
        profile_name = profile_name
        timestamp = time.time()
        text = ""
        message_text = ""
        message_status = "sent"
        msg_sent_by = "DJANGO ADMIN"

        whatsapp_message = WhatsAppMessage(phone_id=settings.WHATSAPP_NUMBERS.get(phone_number, "128538200341271"),
        profile_name=profile_name,
        whatsapp_id=phone_number,
        from_id=phone_number,
        message_id=wp_msg_id,
        timestamp=timestamp,
        text=text,
        phone_number=phone_number,
        message_text=message_text,
        message_text_sent_by = msg_sent_by,
        msg_status_code = message_status,
        fb_media_id = media_id,
        upload_media_path = s3_file_url,
        whatsapp_bussiness_number = whatsapp_bussiness_num
        )
        whatsapp_message.save()

    except Exception as e:
        print(e)


def send_and_upload_video(file_path,s3_file_url, profile_name, phone_number, whatsapp_bussiness_num):
    token =  settings.WHATSAPP_TOKEN.replace("Bearer ", "")
    # Default primary key field type
    messenger = WhatsApp(token , settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    # status_label.config(text=f"Uploading file")
    try:
        media_id = messenger.upload_media(media=file_path).get("id")
        wp_msg_id = messenger.send_video(
        video=media_id,
        recipient_id=phone_number,
        link=False
        ).get("messages")[0].get("id")
        phone_id = ""
        profile_name = profile_name
        timestamp = time.time()
        text = ""
        message_text = ""
        message_status = "sent"
        msg_sent_by = "DJANGO ADMIN"

        whatsapp_message = WhatsAppMessage(phone_id=settings.WHATSAPP_NUMBERS.get(phone_number, "128538200341271"),
        profile_name=profile_name,
        whatsapp_id=phone_number,
        from_id=phone_number,
        message_id=wp_msg_id,
        timestamp=timestamp,
        text=text,
        phone_number=phone_number,
        message_text=message_text,
        message_text_sent_by = msg_sent_by,
        msg_status_code = message_status,
        fb_media_id = media_id,
        upload_media_path = s3_file_url,
        whatsapp_bussiness_number = whatsapp_bussiness_num
        )
        whatsapp_message.save()

    except Exception as e:
        print(e)






def process_msg_rec(data):
    try:
        for entry in data['entry']:
            if 'changes' in entry:
                changes = entry['changes']
                if changes:
                    first_change = changes[0]
                    phoneId = first_change['value']['metadata']['phone_number_id']
                    whatsapp_bussiness_number = first_change['value']['metadata']['display_phone_number']
                    profileName = first_change['value']['contacts'][0]['profile']['name']
                    whatsAppId = first_change['value']['contacts'][0]['wa_id']
                    if 'messages' in first_change['value']:
                        messages = first_change['value']['messages']
                        if messages:
                            first_message = messages[0]
                            phoneNumber = first_message['from']
                            fromId = first_message['from']
                            messageId = first_message['id']
                            timestamp = first_message['timestamp']
                            text = first_message['text']['body']
                            message_text_sent_by = profileName
                            msg_status_code = "READ"
                            message = f'RE: {text} was received'
                            print("msg sent")
                            # sendWhatsAppMessage(phoneNumber, message)
                            # Save WhatsApp message to the database
                            save_whatsapp_message(
                                phoneId,
                                profileName,
                                whatsAppId,
                                fromId,
                                messageId,
                                timestamp,
                                text,
                                phoneNumber,
                                message,
                                message_text_sent_by,
                                msg_status_code,
                                whatsapp_bussiness_number = whatsapp_bussiness_number
                                
                            )
                            
                            print("data saved")
    except Exception as e:
        print(e)
        pass


def process_msg_status(json_data):
    for entry in json_data.get("entry"):
        error_msg = ''
        status_json = entry.get("changes")[0].get("value").get("statuses")[0]
        wp_msg_id = status_json.get("id")
        wp_msg_status = status_json.get("status")
        print(wp_msg_id,wp_msg_status)
        if status_json.get("errors"):
            error_msg = status_json.get("errors")[0].get("error_data").get("details")
            print(error_msg)
        elif wp_msg_status == "read":
            current_datetime = datetime.now()
            date_format = "%m/%d/%Y %I:%M %p"
            error_msg = current_datetime.strftime(date_format)
        
        try:
            message = WhatsAppMessage.objects.get(message_id=wp_msg_id)
            message.msg_status_code = wp_msg_status
            message.msg_status_comment = error_msg
            message.save()

        except Exception as e:
            print(e)
        
    pass





def parse_recd_media_msgs(data):
    token = settings.WHATSAPP_TOKEN.replace("Bearer ", "")
    messenger = WhatsApp(token, "128538200341271")
    message_type = messenger.get_message_type(data)
    print("media root")
    # static_root = settings.STATIC_ROOT
    # business_downloads = os.path.join(static_root, 'business', 'dowmloads')
    business_downloads = f"upload/business/downloads/"
    print(business_downloads)
    upload_dir = None
    filename = None

    profile_name = messenger.get_name(data)
    wp_id = messenger.get_mobile(data)
    message_id = messenger.get_message_id(data)
    timestamp = messenger.get_message_timestamp(data)
    print(data)
    

    file_directory_within_bucket = 'user_upload_files/{username}'.format(username="max")

    # synthesize a full file path; note that we included the filename




    try:
        whatsapp_bussiness_number = data["entry"][0]["changes"][0]["value"]["metadata"]["display_phone_number"]
    except Exception as e:
        print(e)
        whatsapp_bussiness_number = ""

    if message_type == "location":
        message_location = messenger.get_location(data)
        message_latitude = message_location["latitude"]
        message_longitude = message_location["longitude"]
    elif message_type == "image":
        image = messenger.get_image(data)
        image_id, mime_type = image["id"], image["mime_type"]
        image_url = messenger.query_media_url(image_id)
        upload_dir = os.path.join(business_downloads, 'image')
        os.makedirs(upload_dir, exist_ok=True)
        filename = messenger.download_media(image_url, mime_type, os.path.join(upload_dir, image_id))
        print(filename)
        print("uploading")
        filename = upload_file_to_s3(filename,f"received/images")

    elif message_type == "video":
        video = messenger.get_video(data)
        video_id, mime_type = video["id"], video["mime_type"]
        video_url = messenger.query_media_url(video_id)
        upload_dir = os.path.join(business_downloads, 'video')
        os.makedirs(upload_dir, exist_ok=True)
        filename = messenger.download_media(video_url, mime_type, os.path.join(upload_dir, video_id))
        filename = upload_file_to_s3(filename,f"received/video")
    elif message_type == "audio":
        audio = messenger.get_audio(data)
        audio_id, mime_type = audio["id"], audio["mime_type"]
        audio_url = messenger.query_media_url(audio_id)
        upload_dir = os.path.join(business_downloads, 'audio')
        os.makedirs(upload_dir, exist_ok=True)
        filename = messenger.download_media(audio_url, mime_type, os.path.join(upload_dir, audio_id))
        filename = upload_file_to_s3(filename,f"received/audio")
    elif message_type == "document":
        file = messenger.get_document(data)
        file_id, mime_type = file["id"], file["mime_type"]
        file_url = messenger.query_media_url(file_id)
        upload_dir = os.path.join(business_downloads, 'documents')
        os.makedirs(upload_dir, exist_ok=True)
        filename = messenger.download_media(file_url, mime_type, os.path.join(upload_dir, file_id))
        filename = upload_file_to_s3(filename,f"received/docs")
    if upload_dir and filename:
        save_whatsapp_message(phoneId="128538200341271",
                              profileName=profile_name,
                              whatsAppId=wp_id,
                              fromId=wp_id,
                              messageId=message_id,
                              timestamp=timestamp,
                              text="",
                              phoneNumber=wp_id,
                              message="",
                              message_text_sent_by=profile_name,
                              msg_status_code="read",
                              upload_media_path=filename,
                              whatsapp_bussiness_number = whatsapp_bussiness_number
                              )


def mark_msg_seen_by_admin_func(data):
        msg_id = data.get("whatsapp_id")
        try:
            message = WhatsAppMessage.objects.get(message_id=msg_id)
            message.admin_seen_count = 1
            message.save()

        except Exception as e:
            print(e)


def upload_media_on_wp(file_path, whatsapp_bussiness_num):
    token =  settings.WHATSAPP_TOKEN.replace("Bearer ", "")
    messenger = WhatsApp(token , settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    # status_label.config(text=f"Uploading file")
    print("uploading")
    print(file_path)
    try:
        media_id = messenger.upload_media(media=file_path)['id']
        print(media_id)
        return media_id
    except Exception as e:
        print(f"Error cant upload - {e}")
        return None


def send_abandoned_checkout_template(data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    res = messenger.send_template("abandoned_checkout", data.get("to_number"), components=[
    {
            "type": "body",
            "parameters": [
            {
                "type": "text",
                "text": data.get("components")[0]
            },
            {
                "type": "text",
                "text": data.get("components")[1]
            },
            {
                "type": "text",
                "text": data.get("components")[2]
            },
            {
                "type": "text",
                "text": data.get("components")[3]
            },
            ]
    }
    ])
    print(res)

    
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=data.get("from_number"),
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                template_name=data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num
    )

def send_cancelled_template(file_path,s3_file_url, data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    res = messenger.send_template("cancelled", data.get("to_number"), components=[
    {
        "type": "header",
        "parameters": [
            {
            "type": "video",
            "video": {
                "id": upload_media_on_wp(file_path,whatsapp_bussiness_num)
            }
            }
        ]
    },
    {

        "type": "BODY",
        "parameters": [
            {
            "type": "text",
            "text": data.get("components")[0]
            },
            {
            "type": "text",
            "text": data.get("components")[1]
            },
            {
            "type": "text",
            "text": data.get("components")[2]
            }
            ]
    }
    ])
    print(res)

    save_whatsapp_message_template(phoneId="128538200341271",
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=122,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                upload_media_path=s3_file_url,
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num
    )



def send_business_chat_start_normaltext(data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    res = messenger.send_template("business_chat_start_normaltext ", data.get("to_number"), components=[
    {
            "type": "body",
            "parameters": [
            {
                "type": "text",
                "text": data.get("components")[0]
            },
            ]
    }
    ])
    print(res)

    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=data.get("from_number"),
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num
    )

def send_business_start_chat_realtext(data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    res = messenger.send_template("business_start_chat_realtext ", data.get("to_number"), components=[
    {
            "type": "HEADER",
            "parameters": [
            {
                "type": "text",
                "text": data.get("components")[0]
            },
            ]
    }
    ])
    print(res)
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=whatsapp_bussiness_num,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num
    )


def send_business_chat_start_document(media_path,s3_file_url,data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    media_id = upload_media_on_wp(media_path,whatsapp_bussiness_num)
    # print(media_path,data)
    print(media_id)
    res = messenger.send_template("business_chat_start_document", data.get("to_number"), components=[
        {
                            "type": "HEADER",
                            "parameters": [{
                                "type": "document",
                                "document": {
                                "id": media_id
                                }}]
                                },
        {
            
                "type": "body",
                "parameters": [
                {
                    "type": "text",
                    "text": data.get("components")[0]
        }]
                }
                ]
    
        )
    print(res)
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=whatsapp_bussiness_num,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                upload_media_path=s3_file_url,
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num
    )


def send_business_start_chat_photo(media_path,s3_file_url,data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    media_id = upload_media_on_wp(media_path,whatsapp_bussiness_num)
    # print(media_path,data)
    print(media_id)
    res = messenger.send_template("business_start_chat_photo", data.get("to_number"), components=[
        {
                            "type": "HEADER",
                            "parameters": [{
                                "type": "image",
                                "image": {
                                "id": media_id
                                }}]
                                },
        {
            
                "type": "body",
                "parameters": [
                {
                    "type": "text",
                    "text": data.get("components")[0]
        }]
                }
                ]
    
        )
    print(res)
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=whatsapp_bussiness_num,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                upload_media_path=s3_file_url,
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num
    )


def send_busines_start_chat_text(media_path,s3_file_url,data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    media_id = upload_media_on_wp(media_path,whatsapp_bussiness_num)
    # print(media_path,data)
    print(media_id)
    res = messenger.send_template("busines_start_chat_text", data.get("to_number"), components=[
        {
            "type": "HEADER",
            "parameters": [{
                "type": "video",
                "video": {
                    "id": media_id
                }}]
        },
        {

            "type": "body",
            "parameters": [
                {
                    "type": "text",
                    "text": data.get("components")[0]

                },
                {
                    "type": "text",
                    "text": data.get("components")[1]
                }]
        }
    ]

    )
    print(res)
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=whatsapp_bussiness_num,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                upload_media_path=s3_file_url,
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number=whatsapp_bussiness_num
    )



def send_shipped(media_path,s3_file_url,data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    media_id = upload_media_on_wp(media_path,whatsapp_bussiness_num)
    # print(media_path,data)
    print(media_id)
    res = messenger.send_template("shipped", data.get("to_number"), components=[
        {
            "type": "HEADER",
            "parameters": [{
                "type": "video",
                "video": {
                    "id": media_id
                }}]
        },
        {

            "type": "body",
            "parameters": [
                {
                    "type": "text",
                    "text": data.get("components")[0]

                },
                {
                    "type": "text",
                    "text": data.get("components")[1]
                }
                ,
                {
                    "type": "text",
                    "text": data.get("components")[2]
                }
                ,
                {
                    "type": "text",
                    "text": data.get("components")[3]
                }
                ,
                {
                    "type": "text",
                    "text": data.get("components")[4]
                }
                ,
                {
                    "type": "text",
                    "text": data.get("components")[5]
                }
                ,
                {
                    "type": "text",
                    "text": data.get("components")[6]
                }
                ,
                {
                    "type": "text",
                    "text": data.get("components")[7]
                }
                ]
        }
    ]

    )
    print(res)
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=whatsapp_bussiness_num,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                upload_media_path=s3_file_url,
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number=whatsapp_bussiness_num
    )


def send_order_confirmation(media_path,s3_file_url,data):
    whatsapp_bussiness_num = data.get("from_number")
    messenger = WhatsApp(settings.WHATSAPP_TOKEN.replace("Bearer ", ""),   settings.WHATSAPP_NUMBERS.get(whatsapp_bussiness_num, "128538200341271"))
    media_id = upload_media_on_wp(media_path,s3_file_url)
    # print(media_path,data)
    print(media_id)
    res = messenger.send_template("order_confirmation", data.get("to_number"), components=[
        {
            "type": "HEADER",
            "parameters": [{
                "type": "video",
                "video": {
                    "id": media_id
                }}]
        },
        {

            "type": "body",
            "parameters": [
                {
                    "type": "text",
                    "text": data.get("components")[0]

                },
                {
                    "type": "text",
                    "text": data.get("components")[1]

                },
                {
                    "type": "text",
                    "text": data.get("components")[2]

                },
                {
                    "type": "text",
                    "text": data.get("components")[3]

                },
                {
                    "type": "text",
                    "text": data.get("components")[4]

                },
                {
                    "type": "text",
                    "text": data.get("components")[5]

                },
                {
                    "type": "text",
                    "text": data.get("components")[6]

                },
                {
                    "type": "text",
                    "text": data.get("components")[7]

                },
                {
                    "type": "text",
                    "text": data.get("components")[8]

                },
                {
                    "type": "text",
                    "text": data.get("components")[9]

                },
                {
                    "type": "text",
                    "text": data.get("components")[10]

                },
                {
                    "type": "text",
                    "text": data.get("components")[11]

                },
                {
                    "type": "text",
                    "text": data.get("components")[12]

                },
                {
                    "type": "text",
                    "text": data.get("components")[13]

                },
                {
                    "type": "text",
                    "text": data.get("components")[14]

                },
                {
                    "type": "text",
                    "text": data.get("components")[15]

                }                ]
        }
    ]

    )
    print(res)
    save_whatsapp_message_template(phoneId=settings.WHATSAPP_NUMBERS.get(data.get("from_number"), "128538200341271"),
                                profileName=data.get("profile_name"),
                                whatsAppId=data.get("to_number"),
                                fromId=whatsapp_bussiness_num,
                                messageId=res.get("messages", [{}])[0].get("id"),
                                timestamp=time.time(),
                                text="",
                                phoneNumber=data.get("to_number"),
                                message="",
                                message_text_sent_by="DJANGO ADMIN",
                                msg_status_code=res.get("messages", [{}])[0].get("message_status"),
                                is_template=1,
                                template_json=json.dumps(data),
                                wp_template_json=get_meta_template_json(data.get("template_name")),
                                upload_media_path=s3_file_url,
                                template_name = data.get("template_name"),
                                whatsapp_bussiness_number = whatsapp_bussiness_num 
    
    )
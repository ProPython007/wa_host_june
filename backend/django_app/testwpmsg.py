import requests
from websocket import send

WHATSAPP_URL = 'https://graph.facebook.com/v17.0/128538200341271/messages'
WHATSAPP_TOKEN =  "Bearer EAAUovSpndZBABO6m0npKSC9M9cGGWwZCD1Rlc1OZAWaiLnvldsq1nOM7TLogU4ZBZCZBZBdZAIFSGKIAWIJesotLXQ88P5yZB5P1fTFrZAZCnodPfXfTusY5iH6Hz7WjBDuzZBmLDvZAdPIyWZAmAZCM1HUD5Ky6fwnBkqJcPlI6GwTJbgyMN6NX95bSNQCFSwZA6vWEQsZBX"
def sendWhatsAppMessage(phoneNumber, message ):
    headers = {"Authorization" : WHATSAPP_TOKEN}
    payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to" : phoneNumber,
            "type": "text",
            "text" : {"body" : message}    
            }
    response = requests.post(WHATSAPP_URL, headers=headers, json=payload)
    ans = response.json()
    print(ans)
    try:
        message_id = ans['messages'][0]['id']
        return message_id
    except:
        return "Error in sending"
    


sendWhatsAppMessage("919956929372", "hiiiaslih")
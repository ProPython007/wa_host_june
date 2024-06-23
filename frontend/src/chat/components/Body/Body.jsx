import React, { useContext, useState, useEffect, useMemo } from "react";
import { GlobalVariablesContext } from "../../../GlobalVariables";
import axios from "axios";
import Messages from "./Messages";
import Template from "./Template";

function Body() {
  const [ln, setln] = useState(0);
  const [newMessages, setNewMessages] = useState([]);
  const { currentUser } = useContext(GlobalVariablesContext);
  const [tmp, setTmp] = useState(0);

  const fetchMessages = async () => {
    
    try {
      const roomUrl = `${process.env.REACT_APP_CAHTS_API}${currentUser.phone}/${currentUser.wb_num}`;
      const response = await axios.get(roomUrl);

      const receivedMessages = response.data;
    
      const messages = receivedMessages.map((message) => ({
        name: message.profile_name,
        phone_number: message.phone_number,
        message: message.text,
        timestamp: message.timestamp,
        msg_status_comment: message.msg_status_comment,
        msg_status_code: message.msg_status_code,
        sent_by: message.message_text_sent_by,
        media_upload: message.upload_media_path,
        admin_seen_count: message.admin_seen_count,
        message_id: message.message_id,
        is_template: message.is_template,
        wp_template_json: message.wp_template_json,
        template_json: message.template_json,
      }));

      setNewMessages(messages?.reverse());

      if (ln < messages.length) {
        setln(messages.length);
      }

      const url =
        "http://107.173.236.154:8000/update_msg_seen"; // Replace with the actual URL of your API

      // update msg status to seen
      for (let index = 0; index < receivedMessages.length; index++) {
        const wp_msg_element = receivedMessages[index];
        if (wp_msg_element.admin_seen_count === 0) {
          const data = {
            whatsapp_id: wp_msg_element.message_id,
          };
          axios.post(url, data);
        }
      }
    } catch (error) {
      console.log("FetchMessages :: ", error);
      return 0;
      // Return 0 or a default value in case of an error
    }
    setTimeout(
      setTmp((tmp) => tmp + 1),
      800
    );
  };

  useMemo(()=>{
    fetchMessages();
  },[tmp])


  useEffect(()=>{
    const chatContainer = document.querySelector(".Chat__bodyOfMsg");
    chatContainer.scrollTop = chatContainer?.scrollHeight;
  },[ln])

  useEffect(() => {
    setln(0);
    setNewMessages([]);
    const chatContainer = document.querySelector(".Chat__bodyOfMsg");
    chatContainer.scrollTop = chatContainer?.scrollHeight;
  }, [currentUser]);


  return (
    <>
      {newMessages.length > 0 ? (
        newMessages.map((message) =>
          message.is_template ? (
            <Template message={message} key={message.message_id} />
          ) : (
            <Messages message={message} key={message.message_id} />
          )
        )
      ) : (
        <div className="loadingText">Loading...</div>
      )}
    </>
  );
}

export default Body;

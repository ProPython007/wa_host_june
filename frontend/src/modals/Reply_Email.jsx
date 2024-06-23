import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./modal.css";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

function Reply_Email({ open3, email, setOpen3 , tracking_num, selectedEm}) {
  const [subject, setSubject] = useState(`Re: ${email.subject}`);
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading , setLoading] = useState(false)
  const [to , setTo] = useState('')


  const handleFileChange = (e) => {
    setAttachments([...attachments, e.target.files[0]]);
  };
 
  
  const handleSend = async () => {
    try {
      setLoading(true)
      const baseUrl =  process.env.REACT_APP_REPLY_EMAIL_DATA;
      // Handle sending email logic here
      const formData = new FormData();
      formData.append("p_uid", email.email_id);
      formData.append("selected_mail", selectedEm);
      formData.append("mail_body", body);

      // Append attachments
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
      
      // Send POST request with FormData
      const res = await axios.post(
        baseUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      toast.success("Email sent successfully");
      setOpen3(false);
      setLoading(false)
      setBody('')
      setAttachments([])
    } catch (error) {
      setLoading(false)
      toast.error("Failed to send email");
      
    }
  };

  // console.log(tracking_num)
  // setBody(`Hi, I am ${email.from} and I am writing to you regarding the mail ${tracking_num}.\n\n${email.body}`)

 useEffect(() => {
    setTo(selectedEm)
    setBody(`Parcel not delivered AWB ${tracking_num}

Why not deliverin this parcel AWB ${tracking_num}.\n`)
  }, [selectedEm, tracking_num])


  return (
    <Modal
      open={open3}
      onClose={() => setOpen3(false)}
      center
      classNames={{ modal: "customModal" }}
    >
      <h3>Reply Email</h3>
      <div className="reply-email-form">
        
        <div className="form-group">
          <label>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="6"
          />
        </div>
        <div className="form-group">
          <label>Attachments</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
        </div>
       
       {
         loading ?  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <CircularProgress color="primary" size={20} thickness={4} />  
       </div> : <button onClick={handleSend} className="send-btn">
          Send
        </button>
       }
        
      </div>
    </Modal>
  );
}

export default Reply_Email;

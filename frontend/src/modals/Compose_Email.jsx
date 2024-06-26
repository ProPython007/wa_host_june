import React, { useEffect, useState, useContext } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./modal.css";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import GlobalVariablesProvider from "../GlobalVariables";
import { FaArrowLeft } from "react-icons/fa";

function Compose_Email({
  open4,
  setOpen4,
  slected_num,
  email,
  handleOpen,
  tracking_num,
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toCC, setCC] = useState("");

  let data_emails = [
    "nehacool.kk3@gmail.com",
    "rohinishrim@gmail.com",
    "mansingh.kr111@gmail.com",
    "mohanlal.lal1333@gmail.com",
  ];


  useEffect(() => {

    setSubject("");
    setBody("");
    setAttachments([]);
    setCC("");
    setFrom("");
    setTo("");

    //  userData2 && sknekne nejm(userData2.orders.map((item) => item.tracking_number));
    const first_num =
      (Array.isArray(tracking_num) && tracking_num.length !== 0 && typeof tracking_num[0] === 'string' && tracking_num[0].slice(0, 1)) || "";
    const latest_num = (Array.isArray(tracking_num) && tracking_num[0]) || "";
    if (data_emails.includes(email)) {
      if (first_num === "1" || first_num === "3") {
        setTo("1ajay@ecomexpress.in, ecomcaresnorth@ecomexpress.in");
        setCC("rahul.j@ecomexpress.in, yashaswi.agg@gmail.com ");
      } else if (first_num === "8") {
        setTo("sonikap@bluedart.com, kalpanak@bluedart.com");
        setCC("ankit.kt4@gmail.com");
      }
    } else {
      setTo("customerservice@bluedart.com");
      setCC("");
    }

    setSubject(`AWB ${latest_num}: Delivery issue`);
    setFrom(email);
    setBody(`Parcel not delivered AWB ${tracking_num}

Why not deliverin this parcel AWB ${tracking_num}.\n`);
  }, [email, tracking_num]);

  const handleFileChange = (e) => {
    setAttachments([...attachments, e.target.files[0]]);
  };

  const handleSend = async () => {
    const baseUrl = process.env.REACT_APP_SEND_MAIL_API;
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("mail_sub", subject);
      formData.append("selected_mail", from);
      formData.append("mail_body", body);
      formData.append("mail_to", to);
      formData.append("mail_cc", toCC);

      // Append attachments
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      const res = await axios.post(baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const response = await axios.post(
        process.env.REACT_APP_LAST_USED_MAIL_API,
        { [slected_num]: email }
      );
      setLoading(false);
      toast.success("Email sent successfully");
      setOpen4(false);
      setSubject("");
      setBody("");
      setAttachments([]);
      setTo("");
      
    } catch (error) {
      toast.error("Failed to send email");
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open4}
      onClose={() => setOpen4(false)}
      center
      classNames={{ modal: "customModal" }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <FaArrowLeft
          style={{ fontSize: "20px", cursor: "pointer", marginBottom: "20px" }}
          onClick={handleOpen}
        />
        <h1 style={{ marginBottom: "20px", color: "#333" }}>
          Compose New Email
        </h1>
      </div>

      <div className="reply-email-form">
        <div className="form-group">
          <label htmlFor="subject">From</label>
          <input
            type="text"
            id="subject"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">To</label>
          <input
            type="text"
            id="subject"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">CC</label>
          <input
            type="text"
            id="subject"
            value={toCC}
            onChange={(e) => setCC(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

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

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="primary" size={20} thickness={4} />
          </div>
        ) : (
          <button onClick={handleSend} className="send-btn">
            Send
          </button>
        )}
      </div>
    </Modal>
  );
}

export default Compose_Email;

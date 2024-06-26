import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./modal.css";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { MdCloudUpload, MdImage, MdInsertDriveFile } from "react-icons/md"; // Import Material-UI icons
import Files from "react-files"; // Import react-files

function Reply_Email({
  open3,
  email,
  setOpen3,
  slected_num,
  tracking_num,
  selectedEm,
  handleSelectEmail,
}) {
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState("");

  

  const handleFileChange = (files) => {
    setAttachments([...attachments, ...files]);
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_REPLY_EMAIL_DATA;
      const formData = new FormData();
      formData.append("p_uid", email.email_id);
      formData.append("selected_mail", selectedEm);
      formData.append("mail_body", body);

      // Append attachments
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      // Send POST request with FormData
      const res = await axios.post(baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOpen3(false);
      setLoading(false);
      setBody("");
      setAttachments([]);
      

      const response = await axios.post(
        process.env.REACT_APP_LAST_USED_MAIL_API,
        { [slected_num]: selectedEm }
      );
      toast.success("Email sent successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to send email");
    }
  };

  useEffect(() => {
    setTo(selectedEm);
    setBody(
      `Parcel not delivered AWB ${tracking_num}\n\nWhy not delivering this parcel AWB ${tracking_num}.\n`
    );
  }, [selectedEm, tracking_num]);

  return (
    <Modal
      open={open3}
      onClose={() => setOpen3(false)}
      center
      classNames={{ modal: "customModal" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FaArrowLeft
          style={{ fontSize: "20px", cursor: "pointer", marginBottom: "20px" }}
          onClick={() => handleSelectEmail(selectedEm)}
        />
        <h1 style={{ marginBottom: "20px", color: "#333" }}>Reply Email</h1>
      </div>
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
          <div className="files">
            <Files
              className="files-dropzone"
              onChange={handleFileChange}
              accepts={["image/png", ".pdf", "audio/*"]}
              multiple
              maxFileSize={10000000}
              minFileSize={0}
              clickable
            >
              <div className="files-upload-area">
                <MdCloudUpload
                  style={{ fontSize: "40px", marginBottom: "10px" }}
                />
                <p>Drag and drop files here or</p>
                <p>click to select files</p>
              </div>
            </Files>
          </div>
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

export default Reply_Email;

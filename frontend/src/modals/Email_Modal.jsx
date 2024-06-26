import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Collapsible from "react-collapsible";
import "./modal.css";
import { IoIosRefresh } from "react-icons/io";
import { CircularProgress } from "@mui/material";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { decode } from "base64-arraybuffer";

function Email_Modal({
  email,
  open2,
  handleOpen,
  handleClose,
  emails,
  handleReply,
  handleComposeEmail,
  handleSelectEmail,
}) {
  const openPdfInNewTab = (base64pdf) => {
    const byteArray = decode(base64pdf);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const downloadImage = (base64image, filename) => {
    const byteArray = decode(base64image);
    const blob = new Blob([byteArray], { type: "image/*" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderEmail = (email, isReply = false) => (
    <div className={`email-content ${isReply ? "reply" : "main-email"}`}>
      <div className="email-header">
        <div>
          <strong>From:</strong> {email.from}
        </div>
        <div>
          <strong>To:</strong> {email.to.join(", ")}
        </div>
        {email.cc.length > 0 && (
          <div>
            <strong>CC:</strong> {email.cc.join(", ")}
          </div>
        )}
        {email.bcc.length > 0 && (
          <div>
            <strong>BCC:</strong> {email.bcc.join(", ")}
          </div>
        )}
        <div>
          <strong>Date:</strong> {email.date}
        </div>
      </div>
      <div
        className="email-body"
        dangerouslySetInnerHTML={{ __html: email.body }}
      />
      {email.attachments.length > 0 && (
        <div className="email-attachments">
          <strong>Attachments:</strong>
          <ul>
            {email.attachments.map((attachment, index) => {
              const isImage = attachment.content_type.startsWith("image/");
              const isPdf =
                attachment.content_type === "application/pdf" ||
                (attachment.content_type === "application/octet-stream" &&
                  attachment.filename.endsWith(".pdf"));
              const isOctetStream =
                attachment.content_type === "application/octet-stream";
              const isPng =
                isOctetStream && attachment.filename.endsWith(".png");
              const isJpg =
                isOctetStream && attachment.filename.endsWith(".jpg");
              const isJpeg =
                isOctetStream && attachment.filename.endsWith(".jpeg");
              const isGif =
                isOctetStream && attachment.filename.endsWith(".gif");

              const guessedContentType = isImage
                ? attachment.content_type
                : isPdf
                ? "application/pdf"
                : isPng || isJpg || isJpeg || isGif
                ? "image/" + attachment.filename.split(".").pop()
                : "application/octet-stream";
              const attachmentUrl = `data:${guessedContentType};base64,${attachment.content}`;

              return (
                <li
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {isImage || isPng || isJpg || isJpeg || isGif ? (
                    <button
                      onClick={() =>
                        downloadImage(attachment.content, attachment.filename)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={attachmentUrl}
                        alt={attachment.filename}
                        style={{ maxWidth: "40%", height: "auto" }}
                      />
                    </button>
                  ) : isPdf ? (
                    <button
                      onClick={() => openPdfInNewTab(attachment.content)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                      }}
                    >
                      <FaFilePdf size={20} />
                      {attachment.filename}
                    </button>
                  ) : (
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attachment.filename}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => handleReply(email)}
          className="modal_btn"
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Reply
        </button>
      </div>
      {email.replies.length > 0 && (
        <div className="replies">
          {email.replies.map((reply) => (
            <Collapsible
              key={reply.email_id}
              className="reply-item"
              trigger={
                <div className="collapsible-header reply-header">
                  {reply.subject} - {reply.date}
                </div>
              }
            >
              {renderEmail(reply, true)}
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Modal
      open={open2}
      onClose={handleClose}
      style={{ textAlign: "center" }}
      classNames={{ modal: "customModal" }}
      center
    >
      <div
        className="modal-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaArrowLeft
            size={20}
            style={{ cursor: "pointer" }}
            onClick={handleOpen}
          />
          <h1 style={{ color: "#333" }}>Inbox Mails</h1>
        </div>
        <button className="modal_btn" onClick={() => handleSelectEmail(email)}>
          {" "}
          Refresh <IoIosRefresh size={16} />{" "}
        </button>
      </div>

      {emails.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress color="primary" size={40} thickness={4} />
        </div>
      ) : (
        emails.map((email) => (
          <Collapsible
            className="element-item"
            trigger={
              <div className="collapsible-header main-header">
                <div>{email.from.match(/^[^@]+/)[0]}</div>
                <div>{email.subject}</div>
                <div style={{ fontSize: "12px", fontWeight: "normal" }}>
                  {email.date}
                </div>
              </div>
            }
            key={email.email_id}
          >
            {renderEmail(email)}
          </Collapsible>
        ))
      )}
    </Modal>
  );
}

export default Email_Modal;

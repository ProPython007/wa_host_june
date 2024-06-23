import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Collapsible from 'react-collapsible';
import './modal.css';
import { IoIosRefresh } from "react-icons/io";
import { CircularProgress } from "@mui/material";

function Email_Modal({ email, open2, handleClose, emails, handleReply, handleComposeEmail, handleSelectEmail }) {
  
  const renderEmail = (email, isReply = false) => (
    <div className={`email-content ${isReply ? 'reply' : 'main-email'}`}>
      <div className='email-header'>
        <div><strong>From:</strong> {email.from}</div>
        <div><strong>To:</strong> {email.to.join(', ')}</div>
        {email.cc.length > 0 && <div><strong>CC:</strong> {email.cc.join(', ')}</div>}
        {email.bcc.length > 0 && <div><strong>BCC:</strong> {email.bcc.join(', ')}</div>}
        <div><strong>Date:</strong> {email.date}</div>
      </div>
      <div className='email-body' dangerouslySetInnerHTML={{ __html: email.body }} />
      {email.attachments.length > 0 && (
        <div className='email-attachments'>
          <strong>Attachments:</strong>
          <ul>
            {email.attachments.map((attachment, index) => {
              const isImage = attachment.content_type.startsWith('image/');
              const attachmentUrl = isImage ? `data:${attachment.content_type};base64,${attachment.content}` : `path/to/attachments/${attachment.filename}`;
              return (
                <li key={index}>
                  {isImage ? (
                    <img src={attachmentUrl} alt={attachment.filename} style={{ maxWidth: '40%', height: 'auto' }} />
                  ) : (
                    <a href={attachmentUrl} download>{attachment.filename}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => handleReply(email)}
          className='modal_btn'
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Reply
        </button>
      </div>
      {email.replies.length > 0 && (
        <div className='replies'>
          {email.replies.map((reply) => (
            <Collapsible
              key={reply.email_id}
              className='reply-item'
              trigger={
                <div className="collapsible-header reply-header">
                  {reply.subject} - {reply.date}
                </div>
              }>
              {renderEmail(reply, true)}
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Modal open={open2} onClose={handleClose} style={{ textAlign: 'center' }} classNames={{ modal: "customModal" }} center>
      <div className='modal-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#333' }}>Inbox Mails</h1>
        <button className='modal_btn' onClick={() => handleSelectEmail(email)}> Refresh  <IoIosRefresh size={16} />  </button>
      </div>

      {emails.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress color="primary" size={40} thickness={4} />
        </div>
      ) : (
        emails.map((email) => (
          <Collapsible 
            className='element-item' 
            trigger={
              <div className="collapsible-header main-header">
                <div>{email.from.match(/^[^@]+/)[0]}</div>
                <div>{email.subject}</div>
                <div style={{fontSize: '12px', fontWeight: 'normal'}}>{email.date}</div>
              </div>
            }  
            key={email.email_id}>
            {renderEmail(email)}
          </Collapsible>
        ))
      )}
    </Modal>
  );
}

export default Email_Modal;

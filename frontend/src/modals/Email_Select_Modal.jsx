import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Collapsible from 'react-collapsible';
import './modal.css';


const emailData = [
  {
    id: 1,
    name: 'rahul.mishra73333@gmail.com'
  },
  {
    id: 2,
    name: 'samirkumar.rocks333@gmail.com'
  },
  {
    id: 3,
    name: 'samirsheikhcool@gmail.com'
  },
  {
    id: 4,
    name: 'mohanlal.lal1333@gmail.com'
  },
  {
    id: 5,
    name: 'nehacool.kk3@gmail.com'
  },
  {
    id: 6,
    name: 'mansingh.kr111@gmail.com'
  },
  {
    id: 7,
    name: 'ankit.kumartaah@gmail.com'
  },
  {
    id: 8,
    name: 'amanshah.rocks3@gmail.com'
  },
  {
    id: 9,
    name: 'rohinishrim@gmail.com'
  },
  {
    id: 10,
    name: 'support@casualfootwears.com'
  },
  {
    id: 11,
    name: 'info@casualfootwears.com'
  }
 
];


function Email_Select_Modal({ open, handleClose, handleSelectEmail, handleComposeEmail }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      center
      classNames={{ modal: 'main-modal' }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>Please Select Email</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {emailData.map((email) => (
            <li key={email.id} className='element-item'>
              <Collapsible trigger={email.name}>
                <button
                  onClick={() => handleComposeEmail(email.name)}
                  className='modal_btn'
                  style={{ marginRight: '10px' }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                  Send Mail
                </button>
                <button
                  onClick={() => handleSelectEmail(email.name)}
                  className='modal_btn'
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                  Inbox
                </button>
              </Collapsible>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className='modal_btn'
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default Email_Select_Modal;

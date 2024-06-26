import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Collapsible from "react-collapsible";
import "./modal.css";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { IoIosRefresh } from "react-icons/io";

const emailData = [
  {
    id: 1,
    name: "rahul.mishra73333@gmail.com",
  },
  {
    id: 2,
    name: "samirkumar.rocks333@gmail.com",
  },
  {
    id: 3,
    name: "samirsheikhcool@gmail.com",
  },
  {
    id: 4,
    name: "mohanlal.lal1333@gmail.com",
  },
  {
    id: 5,
    name: "nehacool.kk3@gmail.com",
  },
  {
    id: 6,
    name: "mansingh.kr111@gmail.com",
  },
  {
    id: 7,
    name: "ankit.kumartaah@gmail.com",
  },
  {
    id: 8,
    name: "amanshah.rocks3@gmail.com",
  },
  {
    id: 9,
    name: "rohinishrim@gmail.com",
  }

];

let data_emails = [
  "nehacool.kk3@gmail.com",
  "rohinishrim@gmail.com",
  "mansingh.kr111@gmail.com",
  "mohanlal.lal1333@gmail.com",
];

function Email_Select_Modal({
  slected_num,
  open,
  handleClose,
  handleSelectEmail,
  handleComposeEmail,
}) {
  const [selectedNumber, setSelectedNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortedEmails, setSortedEmails] = useState([]);

  const handleLastMail = async () => {
    try {
      setLoading(true);
      
      const data = await axios.get(
        `${process.env.REACT_APP_LAST_USED_MAIL_GET_API}${slected_num}`
      );
      setSelectedNumber(data.data[slected_num]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLastMail();
  }, [slected_num]);

 
  useEffect(() => {
    // Sort emails alphabetically by name
    const sorted = [...emailData].sort((a, b) => a.name.localeCompare(b.name));
    const selectedIndex = sorted.findIndex(email => email.name === selectedNumber);

    if (selectedIndex !== -1) {
      const selectedEmail = sorted.splice(selectedIndex, 1)[0]; // Remove selected email from its position
      sorted.unshift(selectedEmail); // Add selected email to the beginning of the array
    }
  
    setSortedEmails(sorted);
  }, [selectedNumber]);
  
  
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      center
      classNames={{ modal: "customModal" }}
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
            style={{
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={handleClose}
          />
          <h1 style={{ color: "#333" }}>Please Select Email</h1>
        </div>
        <button className="modal_btn" onClick={() => handleLastMail()}>
          {" "}
          Refresh <IoIosRefresh size={16} />{" "}
        </button>
      </div>

      {loading ? (
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
        <div style={{ textAlign: "center", width: "100%" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sortedEmails.map((email) => (
              <li
                style={{
                  backgroundColor:
                    selectedNumber === email.name
                      ? "#007bff"
                      : data_emails.includes(email.name)
                      ? "#A1BAD8"
                      : "",
                  color: selectedNumber === email.name ? "white" : "",
                }}
                key={email.id}
                className="element-item"
              >
                <Collapsible trigger={email.name}>
                  <button
                    onClick={() => handleComposeEmail(email.name)}
                    className="modal_btn"
                    style={{
                      marginRight: "10px",
                      backgroundColor:
                        selectedNumber === email.name ? "white" : "#007bff",
                      color:
                        selectedNumber === email.name ? "#007bff" : "white",
                    }}
                  >
                    Send Mail
                  </button>
                  <button
                    onClick={() => handleSelectEmail(email.name)}
                    className="modal_btn"
                    style={{
                      marginRight: "10px",
                      backgroundColor:
                        selectedNumber === email.name ? "white" : "#007bff",
                      color:
                        selectedNumber === email.name ? "#007bff" : "white",
                    }}
                  >
                    Inbox
                  </button>
                </Collapsible>
              </li>
            ))}
          </ul>
          <button
            onClick={handleClose}
            className="modal_btn"
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}

export default Email_Select_Modal;

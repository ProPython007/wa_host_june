import React, { useState, useEffect, useContext } from "react";
import "./sidebarCSS/sidebarchat.css";
import { Avatar } from "@mui/material";
import userPFP from "./sidebarIMG/userPFP.jpeg";
import { GlobalVariablesContext } from "../GlobalVariables";
import Tick from "./Tick";

function Sidebarchat({
  addNewChat,
  name,
  text,
  phone,
  admin_unseen_count,
  timestamp,
  msg_status_code,
  whatsapp_bussiness_number,
}) {
  const { setCurrentUser } = useContext(GlobalVariablesContext);
  
  const nameFormatter = (name) => {
    if (name.length > 20) {
      return name.slice(0, 10) + "...";
    }
    return name;
  }

  const  msgFormatter = (msg) => {
    if (msg.length > 45) {
      return msg.slice(0, 40) + "...";
    }
    return msg;
  }

  const handleView = () => {
    setCurrentUser({
      name: name,
      phone: phone,
      wb_num: whatsapp_bussiness_number,
    });
    if (window.innerWidth <= 700) {
      document.querySelector(".Sidebar").style.display = "none";
    }
  };

  const fromWhere = (num) => {
    switch (num) {
      case "918278244127":
        return "LD";

      case "918278244128":
        return "LDS";

      case "918278244130":
        return "LTS";

      case "918278244131":
        return "LT";

      case "918278244132":
        return "AMC";

      default:
        return "LD";
    }
  };

  return addNewChat ? (
    <div className="Sidebarchat" onClick={handleView}>
      <div className="chatImg">
        <Avatar src={userPFP} />
      </div>
      <div className="SidebarChat_info">
        <div className="chat-header">
          <h4>
            {nameFormatter(name)} ({phone.slice(2)}){" "}<span>[{fromWhere(whatsapp_bussiness_number)}]</span>
            <p></p>
          </h4>

          <span className="Chat__time-date">
            {new Date(timestamp * 1000).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
            ...
            {new Date(timestamp * 1000).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        <div className="chat-footer">
          <p>
            <Tick msg_status_code={msg_status_code} />
            {msgFormatter(text)}
          </p>
          {admin_unseen_count !== 0 && (
            <span className="msgCount">{admin_unseen_count}</span>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default Sidebarchat;

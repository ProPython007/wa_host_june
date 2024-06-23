import React from 'react'
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import "./sidebarCSS/tick.css"
function Tick({ msg_status_code }) {
  return (
    <span className="tick_font">
      {msg_status_code === "accepted" && (
        <span className="GreenTick">
          <DoneAllIcon />
        </span>
      )}
      {msg_status_code === "read" && (
        <span className="BlueTick">
          <DoneAllIcon />
        </span>
      )}
      {msg_status_code === "sent" && (
        <span className="WhiteTick">
          <DoneIcon />
        </span>
      )}
      {msg_status_code === "delivered" && (
        <span className="WhiteTick">
          <DoneAllIcon />
        </span>
      )}
      {msg_status_code === "failed" && <span className="RedTick">🚫</span>}
    </span>
  );
}

export default Tick;

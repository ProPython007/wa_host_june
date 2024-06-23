import React from 'react'
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

function TimenTick({ message }) {
  return (
    <div className="divDnT">
      <span className="Chat__Time">
        {new Date(message.timestamp * 1000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })}{" "}
        at{" "}
        {new Date(message.timestamp * 1000).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </span>

      <span className="tick_font">
        {message.msg_status_code === "accepted" && (
          <div className="tooltip">
            <span className="GreenTick">
              <DoneAllIcon />
            </span>
          </div>
        )}
        {message.msg_status_code === "read" && (
          <div className="tooltip">
            <span className="tooltiptext">{message.msg_status_comment}</span>
            <span className="BlueTick">
              <DoneAllIcon />
            </span>
          </div>
        )}
        {message.msg_status_code === "sent" && (
          <span className="WhiteTick">
            <DoneIcon />
          </span>
        )}
        {message.msg_status_code === "delivered" && (
          <span className="WhiteTick">
            <DoneAllIcon />
          </span>
        )}
        {message.msg_status_code === "failed" && (
          <div className="tooltip">
            <span className="tooltiptext">{message.msg_status_comment}</span>

            <span className="RedTick">🚫</span>
          </div>
        )}
      </span>
    </div>
  );
}

export default TimenTick;

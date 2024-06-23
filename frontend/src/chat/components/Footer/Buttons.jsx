import React, { useContext, useRef, useState } from "react";
import "./footerCss/buttons.css";
import { GlobalVariablesContext } from "../../../GlobalVariables";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Buttons({setInput}) {
  const { userData2 } = useContext(GlobalVariablesContext);
  const latestOrder = userData2?.orders.at(-1);
  const [isHide,setIsHide] = useState(true);
  const ref = useRef();
  return (
    userData2 && (
      <div className="btnContainer">
        {!isHide && (
          <div className="multi-button" ref={ref}>
            <button className="outer-left">{latestOrder.date_Time}</button>
            <button>{latestOrder.order_status}</button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(latestOrder.trackcode_date_time);
                setInput((pre) => pre + latestOrder.trackcode_date_time);
              }
              }
            >
              Trackcode Date Time
            </button>
            <button
              onClick={() =>{
                navigator.clipboard?.writeText(latestOrder.tracking_Link);
                setInput((pre) => pre + latestOrder.tracking_Link);
              }
              }
            >
              Tracking Link
            </button>
            <button
              onClick={() =>{
                navigator.clipboard?.writeText(latestOrder.services);
                setInput((pre) => pre + latestOrder.services);
              }
              }
            >
              Services
            </button>
            <button
              className="outer-right"
              onClick={() => {
                navigator.clipboard?.writeText(latestOrder.email);
                setInput((pre) => pre + latestOrder.email);
              }}
            >
              Email
            </button>
          </div>
        )}
        <div className="hide" onClick={() => setIsHide(!isHide)}>
          {isHide ? (
            <VisibilityIcon className="icon" />
          ) : (
            <VisibilityOffIcon className="icon" />
          )}
        </div>
      </div>
    )
  );
}

export default Buttons;

import "./CSS/Popup.css";
import CloseIcon from "@mui/icons-material/Close";

const Popup = ({ setIsShowPopup, popupMsg, setIsPopUpClosed = null }) => {
  return (
    <div className="popup">
      <div className="popup-main">
        {popupMsg}
        <CloseIcon
          className="closeIcon"
          onClick={() => {
            setIsShowPopup(false);
            if (setIsPopUpClosed) {
              setIsPopUpClosed(true);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Popup;

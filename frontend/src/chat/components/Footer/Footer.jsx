import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import MoodIcon from "@mui/icons-material/Mood";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SendIcon from "@mui/icons-material/Send";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ImageIcon from "@mui/icons-material/Image";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { GlobalVariablesContext } from "../../../GlobalVariables";
import Buttons from "./Buttons";
import UploadProgress from "../Header/UploadProgress";
import Popup from "../../../UniversalCmpt/Popup";
import MicIcon from "@mui/icons-material/Mic";
import VoiceRecorder from "./VoiceRecorder";

function Footer() {

  const [input, setInput] = useState("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useContext(GlobalVariablesContext);
  const [isShowProgress, setIsShowProgress] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isMicOpen, setMicOpen] = useState(false);
  const [popup,setPopup] = useState(false);
  const textarea = useRef();

  

  const handleEmojiSelect = (event, emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (window.innerWidth > 700 && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      } else if (e.shiftKey || window.innerWidth <= 700) {
        e.preventDefault();
        setInput((pre) => pre + "\n");
        autoEx();
      }
    }
  };

  const sendMessage = async () => {
    if (input.length > 0) {
      try {
        let sendingMessage = {
          profile_name: currentUser.name,
          message_text: input,
          phone_number: currentUser.phone,
          from_number: currentUser.wb_num,
        };

        // Prepare the headers
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer dummy_token",
        };

        setInput("");
        textarea.current.style.height = "4rem";
        await axios.post(process.env.REACT_APP_SEND_MSG_API, sendingMessage, {
          headers,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const autoEx = () => {
    textarea.current.style.height = "4rem";
    textarea.current.style.height =
      Math.min(textarea.current.scrollHeight, 120) + "px";
  };

  const sendVideo = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".mp4, .webp, .mov"; // Specify the accepted file types (e.g., .png)

    fileInput.onchange = (event) => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append("video", selectedFile);
        formData.append("profile_name", currentUser.name);
        formData.append("phone_number", currentUser.phone);
        formData.append("from_number", currentUser.wb_num);

        axios
          .post(process.env.REACT_APP_VIDEO_API, formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setIsShowProgress(true);
              setPercentage(percentCompleted);
            },
          })
          .then(() => {
            setIsShowProgress(false);
          })
          .catch((error) => {
            setIsShowProgress(false);
            setIsShowPopup(true);
            console.log("Error uploading vdieo :: ", error);
          });
      }
    };

    fileInput.click();
    setShowDropdown(false);
  };

  const sendDocument = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.accept = "application/docx";

    fileInput.onchange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const formData = new FormData();
        formData.append("document", selectedFile);
        formData.append("profile_name", currentUser.name);
        formData.append("phone_number", currentUser.phone);
        formData.append("from_number", currentUser.wb_num);

        axios
          .post(process.env.REACT_APP_UPLOAD_DOC_API, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setIsShowProgress(true);
              setPercentage(percentCompleted);
            },
          })
          .then(() => {
            setIsShowProgress(false);
          })
          .catch((error) => {
            setIsShowProgress(false);
            setIsShowPopup(true);
            console.log("Error uploading vdieo :: ", error);
          });
      }
    };

    fileInput.click();
    setShowDropdown(false);
  };

  const sendImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png";
    fileInput.accept = ".jpeg";
    fileInput.accept = ".jpg";

    fileInput.onchange = (event) => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("profile_name", currentUser.name);
        formData.append("phone_number", currentUser.phone);
        formData.append("from_number", currentUser.wb_num);

        axios
          .post(process.env.REACT_APP_MEDIA_API, formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setIsShowProgress(true);
              setPercentage(percentCompleted);
            },
          })
          .then((res) => {
            console.log(res)
            setIsShowProgress(false);
          })
          .catch((error) => {
            setIsShowProgress(false);
            setIsShowPopup(true);
            console.log("Error uploading vdieo :: ", error);
          });
      }
    };

    fileInput.click();
    setShowDropdown(false);
  };

  return (
    <>
      {isShowPopup && (
        <Popup
          setIsShowPopup={setIsShowPopup}
          popupMsg="Can't upload, Try again."
        />
      )}
      {isShowProgress && (
        <div className="ProgressContainer">
          <UploadProgress percentage={percentage} />
        </div>
      )}

      {popup && (
        <Popup
          setIsShowPopup={setPopup}
          popupMsg={"Error accessing microphone"}
        />
      )}
      <div className="chatFooterElements">
        <Buttons setInput={setInput} />

        {isMicOpen ? (
          <VoiceRecorder setMicOpen={setMicOpen}/>
        ) : (
          <div className="whenMicNotOpen">
            <div>
              {openEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}

              <MicIcon
                className="emojiIcon"
                onClick={() => {
                  setMicOpen(true);
                }}
              />
              <MoodIcon
                className="emojiIcon"
                onClick={() => {
                  setOpenEmojiPicker(!openEmojiPicker);
                }}
              />
            </div>

            <textarea
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message"
              onKeyDown={handleKeyPress}
              onInput={autoEx}
              ref={textarea}
            />

            <AddCircleIcon
              className="addIcon"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {showDropdown && (
              <div
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="dropdown-item" onClick={() => sendDocument()}>
                  <AttachmentIcon /> Send Document
                </span>
                <span className="dropdown-item" onClick={() => sendVideo()}>
                  <VideoCallIcon /> Send Video
                </span>
                <span className="dropdown-item" onClick={() => sendImage()}>
                  <ImageIcon /> Send Image
                </span>
              </div>
            )}

            <SendIcon className="sendIcon" onClick={sendMessage} />
          </div>
        )}
      </div>
    </>
  );
}

export default Footer;

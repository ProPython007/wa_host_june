import React, { useState, useEffect, useContext, useRef } from "react";
import "./footerCss/VoiceRecorder.css";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalVariablesContext } from "../../../GlobalVariables";
import axios from "axios";
import Popup from "../../../UniversalCmpt/Popup";

const VoiceRecorder = ({ setMicOpen }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [paused, setPaused] = useState(false);
  const [counter, setCounter] = useState(0);
  const [recording, setRecording] = useState(false);
  const { currentUser } = useContext(GlobalVariablesContext);
  const [isPopUpClosed, setIsPopUpClosed] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const isDelRef = useRef(true);

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    if (isPopUpClosed) {
      setRecording(false);
      setMicOpen(false);
    }
  }, [isPopUpClosed]);

  useEffect(() => {
    let timer;
    if (recording && !paused) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [recording, paused]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = function (event) {
          chunks.push(event.data);
        };

        recorder.onstop = function (e) {
          const audioBlob = new Blob(chunks, {
            type: "ogg/opus",
          });
          if (isDelRef.current) {
            sendRecording(audioBlob);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
      })
      .catch((error) => {
        setIsShowPopup(true);
        setPaused(true);
        console.log("Error accessing microphone:", error);
        setPopupMsg("Error accessing microphone");
      });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); 
    const month = ("0" + (now.getMonth() + 1)).slice(-2); 
    const day = ("0" + now.getDate()).slice(-2); 
    const hours = ("0" + now.getHours()).slice(-2); 
    const minutes = ("0" + now.getMinutes()).slice(-2); 
    const seconds = ("0" + now.getSeconds()).slice(-2); 
    return `audio_${day}_${month}_${year}_${hours}_${minutes}_${seconds}.ogg`;
  };

  const sendRecording = (audioBlob) => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("document", audioBlob, getCurrentDateTime());
      formData.append("profile_name", currentUser.name);
      formData.append("phone_number", currentUser.phone);
      formData.append("from_number", currentUser.wb_num);
      axios
        .post(process.env.REACT_APP_UPLOAD_DOC_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((error) => {
          setIsShowPopup(true);
          setPaused(true);
          console.log("Error uploading Voice recording :: ", error);
          setPopupMsg("Error uploading Voice recording");
        });
      setRecording(false);
      setMicOpen(false);
    } else {
      setIsShowPopup(true);
      setPaused(true);
    }
  };

  const stopRecording = (isDel) => {
    if (!isDel) {
      isDelRef.current = false;
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setRecording(false);
    setMicOpen(false);
  };

  const togglePause = () => {
    if (mediaRecorder) {
      if (paused) {
        mediaRecorder.resume();
        setPaused(false);
      } else {
        mediaRecorder.pause();
        setPaused(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="vrContainer">
      {isShowPopup && (
        <Popup
          setIsShowPopup={setIsShowPopup}
          popupMsg={popupMsg}
          setIsPopUpClosed={setIsPopUpClosed}
        />
      )}
      <div className="recording">
        <div className="delNrp">
          <DeleteIcon fontSize="large" onClick={() => stopRecording(false)} />
          <span onClick={togglePause}>
            {paused ? (
              <PlayArrowIcon fontSize="large" />
            ) : (
              <PauseIcon fontSize="large" />
            )}
          </span>
        </div>
        <div className="animationContainer">
          <div className="recordingAnimation"></div>
          <span>{formatTime(counter)}</span>
        </div>
        <SendIcon fontSize="large" onClick={stopRecording} />
      </div>
    </div>
  );
};

export default VoiceRecorder;

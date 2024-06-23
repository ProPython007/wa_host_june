import React, { useEffect, useMemo, useState } from "react";
import "./headerCss/FormForTemplate.css";
import SendTemplateData from "./SendTemplateData";
import UploadProgress from "./UploadProgress";
function FormForTemplate({
  isAttachment = false,
  setIsShowForm,
  template_name,
  currentUser,
  media_type,
  accepted_files = ".pdf",
}) {
  const [isShowProgress, setIsShowProgress] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [isError, setIsError] = useState(false);
  const [input,setInput] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    const file = document.getElementById("file");
    SendTemplateData({
      currentUser: currentUser,
      template_name: template_name,
      input: input,
      media_type: media_type,
      file: isAttachment ? file : null,
      setIsShowProgress,
      setPercentage,
      setIsShowForm,
      setIsError,
    });
  };

  return (
    <div className="formForTemplate">
      <h1>{template_name}</h1>
      <form onSubmit={handleSend}>
        {media_type === "VIDEO" ? (
          <input
            type="text"
            placeholder="Enter your value"
            id="inputVal"
            onChange={(e) => setInput(e.target.value)}
            disabled={isShowProgress ? true : false}
            required
          />
        ) : null}
        
        {isAttachment && (
          <input type="file" id="file" accept={accepted_files} required />
        )}
        <button>Send</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsShowForm(false);
          }}
        >
          Close
        </button>
        
        {isShowProgress && !isError && (
          <UploadProgress percentage={percentage} />
        )}
        {isError && <span className="notUpload">Can't uplaod, Try agian.</span>}
      </form>
    </div>
  );
}

export default FormForTemplate;

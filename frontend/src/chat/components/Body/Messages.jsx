import React, { useMemo, useState } from "react";
import TimenTick from "./TimenTick";

function Messages({ message }) {
  const [changeClass, setChangeClass] = useState(false);

  useMemo(() => changeClass, [changeClass]);

  const mediaType = (url) => {
    try {
      const path = new URL(url).pathname;
      const media = ["videos", "images", "docs"].find((value) =>
        path.includes(value)
      );
      return media ? media : null;
    } catch {
      return null;
    }
  };

  const removeQueryParams = (url) => {
    const parts = url.split("?");
    if (parts.length > 1) {
      const baseUrl = parts[0];
      return baseUrl;
    } else {
      return url;
    }
  };

  const extn = (url) =>
    url.split("/").pop().split(".").pop().split("?").shift();

  return (
    <>
      {message.message.length > 0 ? (
        <div
          className={`Chat__Messages msgFrom${
            message.sent_by === "DJANGO ADMIN" ? "Chat__Reciver" : ""
          }`}
        >
          <span className="Chat__MessageContent">
            <pre>{message.message}</pre>

            <TimenTick message={message} />
          </span>
        </div>
      ) : (
        <div
          className={`Chat__Messages media msgFrom${
            message.sent_by === "DJANGO ADMIN" ? "Chat__Reciver" : ""
          }`}
        >
          {message.media_upload ? (
            mediaType(message.media_upload) == "images" ? (
              <div
                className={changeClass ? "coverScreen" : ""}
                onClick={() => setChangeClass(!changeClass)}
              >
                <div className="imgNtd">
                  <img
                    src={`${removeQueryParams(message.media_upload)}`}
                    alt="Media"
                    className={changeClass ? "fullImg" : "Chat__MessageImage"}
                    onClick={(e) =>
                      changeClass ? e.stopPropagation() : setChangeClass(true)
                    }
                  />

                  <TimenTick message={message} />

                  <div>
                    <a
                      href={`${message.media_upload}`}
                      download={message.media_upload?.split("/").slice(-1)[0]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="btn">Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <span className="Chat__MessageContent">
                {mediaType(message.media_upload) == "videos" ? (
                  <video controls preload="none">
                    <source src={`${removeQueryParams(message.media_upload)}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : ["ogg; codecs=opus", "mpeg", "mp3", "ogg"].includes(
                    extn(message.media_upload)
                  ) ? (
                  <audio controls preload="none">
                    <source src={`${removeQueryParams(message.media_upload)}`} type="audio/ogg" />
                    <source src={`${removeQueryParams(message.media_upload)}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <a
                    href={`${message.media_upload}`}
                    download={message.media_upload?.split("/").slice(-1)[0]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {message.media_upload?.split("/").slice(-1)[0]}
                    <p></p>
                    <span>Download</span>
                  </a>
                )}
                <TimenTick message={message} />
              </span>
            )
          ) : null}
        </div>
      )}
    </>
  );
}

export default Messages;

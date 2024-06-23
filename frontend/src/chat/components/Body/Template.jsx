import React from "react";
import "./bodyCss/Template.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import TimenTick from "./TimenTick";
function Template({ message }) {
  
  const data = JSON.parse(message.wp_template_json)?.data[0];
  const component = JSON.parse(message?.template_json)?.components;
  
  const textShorter = (txt) => {
    if (txt.length > 45) {
      return txt.slice(0, 30) + "...";
    }
    return txt;
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
  return (
    <div
      className={`Chat__Messages msgFrom${
        message.sent_by === "DJANGO ADMIN"
          ? "Chat__Reciver Template"
          : "Template"
      }`}
    >
      <span className="Chat__MessageContent">
        <pre>
          <div className="component">
            {data?.name !== "business_chat_start_normaltext" &&
            data?.name !== "business_start_chat_realtext" ? (
              <>
                <div className="component_header">
                  {data?.components[0].format === "VIDEO" ? (
                    <video controls preload="none">
                      <source
                        src={`${removeQueryParams(message.media_upload)}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : data?.components[0].format === "IMAGE" ? (
                    <div className="imgNtd">
                      <img
                        src={`${removeQueryParams(message.media_upload)}`}
                        alt="Media"
                        className={"Chat__MessageImage"}
                        onClick={(e) => {
                          e.target.classList.toggle("fullImg");
                          e.target.classList.toggle("Chat__MessageImage");
                        }}
                      />
                    </div>
                  ) : data?.components[0].format === "DOCUMENT" ? (
                    <a
                      href={`${message.media_upload}`}
                      download={message?.media_upload?.split("/").slice(-1)[0]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="TemplateDoc">
                        <InsertDriveFileOutlinedIcon className="fileIcon" />{" "}
                        <span>
                          {message?.media_upload
                            ? textShorter(
                                message?.media_upload?.match(/\/([^\/]+)$/)[1]
                              )
                            : "null"}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <span>
                      {message?.media_upload?.split("/").slice(-1)[0]}
                      <p></p>
                      <span>LEDSHOE</span>
                    </span>
                  )}
                </div>

                <div className="component_bodyWFooter">
                  <span className="bodyText">
                    {data?.components[0].format === "VIDEO"
                      ? data?.components[1]?.text
                          .replace(/\{\{2\}\}/g, "LEDSHOE")
                          .replace(/\{\{1\}\}/g, component[0])
                      : data?.components[1]?.text.replace(
                          /\{\{1\}\}/g,
                          "LEDSHOE"
                        )}
                  </span>

                  <span className="component_footer">
                    {String(data?.components[2]?.text)}
                  </span>
                </div>

                <div className="component_buttons">
                  {data?.components[3]?.buttons?.map((btn) => (
                    <a
                      href={`${btn?.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btnDiv"
                      key={message.message_id + btn?.text}
                    >
                      <OpenInNewIcon />
                      <span> {btn?.text}</span>
                    </a>
                  ))}
                </div>
              </>
            ) : data?.name == "business_chat_start_normaltext" ? (
              <>
                <div className="component_bodyWFooter">
                  <span className="bodyText">
                    {String(
                      data?.components[0]?.text.replace(/\{\{1\}\}/g, "LEDSHOE")
                    )}
                  </span>

                  <span className="component_footer">
                    {String(data?.components[1]?.text)}
                  </span>
                </div>
                <div className="component_buttons">
                  {data?.components[2]?.buttons?.map((btn) => (
                    <a className="btnDiv" key={message.message_id + btn?.text}>
                      <ReplyIcon />
                      <span> {btn?.text}</span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="component_bodyWFooter">
                  <span className="bodyText">
                    {String(
                      data?.components[0]?.text.replace(/\{\{1\}\}/g, "LEDSHOE")
                    )}
                    <br />
                    {String(data?.components[1]?.text)}
                  </span>
                  <span className="component_footer">
                    {String(data?.components[2]?.text)}
                  </span>
                </div>
                <div className="component_buttons">
                  {data?.components[3]?.buttons?.map((btn) => (
                    <a className="btnDiv" key={message.message_id + btn?.text}>
                      <ReplyIcon />
                      <span> {btn?.text}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </pre>

        <TimenTick message={message} />
      </span>
    </div>
  );
}

export default Template;

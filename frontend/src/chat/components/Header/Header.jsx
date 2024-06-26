import React, { useContext, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideocamIcon from "@mui/icons-material/Videocam";
import ShortTextIcon from "@mui/icons-material/ShortText";
import NotesIcon from "@mui/icons-material/Notes";
import axios from "axios";
import toast from "react-hot-toast";
import OpenDialogBox from "./OpenDialogBox";
import { GlobalVariablesContext } from "../../../GlobalVariables";
import FormForTemplate from "./FormForTemplate";

import Email_Select_Modal from "../../../modals/Email_Select_Modal";
import Email_Modal from "../../../modals/Email_Modal";
import Reply_Email from "../../../modals/Reply_Email";
import Compose_Email from "../../../modals/Compose_Email";

function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser, setCurrentUser } = useContext(GlobalVariablesContext);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowTemplateList, setIsShowTemplateList] = useState(false);
  const [forForm, setForForm] = useState({});
  const { userData2 } = useContext(GlobalVariablesContext);
  // -------------------------------------------------------------------------------
  const [selectedEmail, setSelectedEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [composEmail, setComposEmail] = useState("");
  const [open4, setOpen4] = useState(false);
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [replyEmail, setReplyEmail] = useState({});
  const [tracking_num, setTracking_num] = useState({});
  const [slected_num, setSelectedNum] = useState("");

  useEffect(() => {
    if (userData2) {
      setTracking_num(userData2.orders.map((item) => item.tracking_number));
    }
    else {
      setTracking_num({})
    }
    const num =
      currentUser.phone.length >= 12
        ? currentUser.phone.slice(2)
        : currentUser.phone;
    setSelectedNum(num);
  }, [userData2, currentUser]);

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
    setEmails([]);
  };

  const handleOpen = () => {
    setOpen(true);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
  };

  const handleSelectEmail = async (email) => {
    setEmails([]);


    try {
      setOpen2(true);
      setOpen(false);
      setOpen3(false);
      const response = await axios.get(
        `${process.env.REACT_APP_FETCH_API_DATA}${email}`
      );
      setEmails(response.data);
      setEmail(email);
      toast.success("Email fetched successfully");
      // setLoader(false);
    } catch (error) {
      setOpen2(false);
      toast.error("Failed to fetch email");
    }
  };

  const handleReply = (email) => {
    setOpen3(true);
    setOpen2(false);
    setReplyEmail(email);
  };

  const handleComposeEmail = (email) => {
    setOpen(false);
    setOpen2(false);
    setOpen4(true);
    setSelectedEmail(email);
  };
  // Modals and functions END

  // -------------------------------------------------------------------------------

  const handleBackBtn = () => {
    document.querySelector(".Sidebar").style.display = "flex";
    setCurrentUser(null);
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

  return (
    <>
      {isShowForm && (
        <FormForTemplate
          inputBoxCount={forForm.inputBoxCount}
          isAttachment={forForm.isAttachment}
          setIsShowForm={setIsShowForm}
          template_name={forForm.template_name}
          currentUser={currentUser}
          media_type={forForm.media_type}
          accepted_files={forForm.accepted_files}
        />
      )}

      <div className="leftOfHeader">
        <button className="openDialogBtn arrowBtn" onClick={handleBackBtn}>
          <ArrowBackIcon />
        </button>

        <button className="openDialogBtn" onClick={() => setIsDialogOpen(true)}>
          Open Dialog
        </button>

        {isDialogOpen && <OpenDialogBox setIsDialogOpen={setIsDialogOpen} />}

        <div className="Chat__headerinfo">
          <h3 id="chat_name">
            {currentUser ? (
              `${currentUser.name} (${currentUser.phone.slice(2)}) [${fromWhere(
                currentUser.wb_num
              )}]`
            ) : (
              <span>LOADING...</span>
            )}
          </h3>
        </div>
      </div>

      <div className="Chat__headerright">
        {isShowTemplateList && (
          <div className="headerDropDown" onClick={(e) => e.stopPropagation()}>
            <span
              className="dropdown-item"
              onClick={() => {
                setForForm({
                  inputBoxCount: 1,
                  template_name: "business_chat_start_normaltext",
                  isAttachment: false,
                  media_type: "normalText",
                });
                setIsShowForm(true);
                setIsShowTemplateList(false);
              }}
            >
              <ShortTextIcon /> business_chat_start_normaltext
            </span>

            <span
              className="dropdown-item"
              onClick={() => {
                setForForm({
                  inputBoxCount: 1,
                  template_name: "business_start_chat_realtext",
                  isAttachment: false,
                  media_type: "realText",
                });
                setIsShowForm(true);
                setIsShowTemplateList(false);
              }}
            >
              <NotesIcon /> business_start_chat_realtext
            </span>

            <span
              className="dropdown-item"
              onClick={() => {
                setForForm({
                  inputBoxCount: 1,
                  template_name: "business_start_chat_photo",
                  isAttachment: true,
                  media_type: "PNG/JPG/JPEG",
                  accepted_files: "image/*",
                });
                setIsShowForm(true);
                setIsShowTemplateList(false);
              }}
            >
              <InsertPhotoIcon /> business_start_chat_photo
            </span>

            <span
              className="dropdown-item"
              onClick={() => {
                setForForm({
                  inputBoxCount: 1,
                  template_name: "business_chat_start_document",
                  isAttachment: true,
                  media_type: "PDF",
                  accepted_files: ".pdf",
                });
                setIsShowForm(true);
                setIsShowTemplateList(false);
              }}
            >
              <PictureAsPdfIcon /> business_chat_start_document
            </span>

            <span
              className="dropdown-item"
              onClick={() => {
                setForForm({
                  inputBoxCount: 2,
                  template_name: "busines_start_chat_text",
                  isAttachment: true,
                  media_type: "VIDEO",
                  accepted_files: "video/mp4,video/x-m4v,video/*",
                });
                setIsShowForm(true);
                setIsShowTemplateList(false);
              }}
            >
              <VideocamIcon /> busines_start_chat_text
            </span>
          </div>
        )}
        <button
          onClick={handleOpen}
          style={{
            marginRight: "30px",
            border: "none",
            backgroundColor: "#90EE90",
            borderRadius: "5px",
            padding: "12px 12px",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Notification
        </button>
        <Email_Select_Modal
          slected_num={slected_num}
          open={open}
          handleSelectEmail={handleSelectEmail}
          handleClose={handleClose}
          handleComposeEmail={handleComposeEmail}
        />
        <Email_Modal
          open2={open2}
          handleOpen={handleOpen}
          handleClose={handleClose}
          email={email}
          emails={emails}
          handleReply={handleReply}
          handleComposeEmail={handleComposeEmail}
          handleSelectEmail={handleSelectEmail}
        />
        <Reply_Email
          open3={open3}
          slected_num={slected_num}
          tracking_num={tracking_num}
          email={replyEmail}
          selectedEm={email}
          setOpen3={setOpen3}
          handleSelectEmail={handleSelectEmail}
        />
        <Compose_Email
          open4={open4}
          slected_num={slected_num}
          handleOpen={handleOpen}
          email={selectedEmail}
          setOpen4={setOpen4}
          tracking_num={tracking_num}
        />
        <LibraryBooksIcon
          onClick={() => setIsShowTemplateList(!isShowTemplateList)}
        />
      </div>
    </>
  );
}

export default Header;

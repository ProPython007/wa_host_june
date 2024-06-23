import React, { useState, useEffect, useContext } from "react";
import "./sidebarCSS/sidebar.css";
import { Avatar, Tooltip } from "@mui/material";
import {
  AddCircleOutline,
  SearchRounded,
  Clear,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import axios from "axios";
import Sidebarchat from "./Sidebarchat";
import adminPFP from "./sidebarIMG/adminPFP.jpeg";
import { GlobalVariablesContext } from "../GlobalVariables";

// import Email_Select_Modal from "../modals/Email_Select_Modal";
// import Email_Modal from "../modals/Email_Modal";
// import toast from "react-hot-toast";
// import Reply_Email from "../modals/Reply_Email";
// import Compose_Email from "../modals/Compose_Email";


function Sidebar() {
  const [search, setSearch] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarBool, setSidebarBool] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [tmp, setTmp] = useState(0);
  const {setIsLoggedIn} = useContext(GlobalVariablesContext)
  const [loader, setLoader] = useState(false);

  // // Modals and functions START
  // const [selectedEmail, setSelectedEmail] = useState('');
  // const [open, setOpen] = useState(false);
  // const [open2, setOpen2] = useState(false);
  // const [open3, setOpen3] = useState(false);
  // const [composEmail, setComposEmail] = useState('');
  // const [open4, setOpen4] = useState(false);
  // const [emails, setEmails] = useState([]);
  // const [replyEmail, setReplyEmail] = useState({});

  // const handleClose = () => {
  //   setOpen(false);
  //   setOpen2(false);
  // }

  // const handleOpen = () => {
  //   setOpen(true);
  // }

  // const handleSelectEmail = async(email) => {
   
  //   setLoader(true);
  //   try {
  //     setOpen2(true);
  //     setOpen(false);  
  //     const response = await axios.get(`http://127.0.0.1:8000/api/fetch_mails/${email}`);
  //     setEmails(response.data);
     
  //     toast.success("Email fetched successfully");
  //     setLoader(false);

  //   } catch (error) {
  //     setOpen2(false);
  //     toast.error("Failed to fetch email");
  //   }
  // }

  // const handleReply = (email) => {
  //   setOpen3(true);
  //   setOpen2(false);
  //   setReplyEmail(email);

  // }

  // const handleComposeEmail = (email) => {
  //   setOpen(false);
  //   setOpen2(false);
  //   setOpen4(true);
  //   setSelectedEmail(email);
  // }
  // // Modals and functions END
  
  useEffect(() => {
    getRooms();
  }, [tmp]);

  useEffect(() => {
    if (rooms.length > 0) {
      setSearch(matcher(input, rooms));
    }
    if (input === "") {
      setSidebarBool(true);
    }
  }, [input]);

  const getRooms = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_ROOMS_API);
      const chatRooms = response.data.recent_messages.map((room) => ({
        id: room.id,
        name: room.profile_name,
        text: room.text,
        phone: room.phone_number,
        message_count: room.message_count,
        admin_unseen_count: room.admin_unseen_count,
        timestamp: room.timestamp,
        msg_status_code: room.msg_status_code,
        whatsapp_bussiness_number: room.whatsapp_bussiness_number,
      }));
      setRooms(chatRooms);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setTimeout(() => {
      setTmp((pre) => pre + 1);
    }, 6000);
  };

  const createChat = () => {
    const roomName = prompt("Please enter a name for the chat");
    const roomNumber = prompt("Please enter a number for the chat");
    
    if (roomName && roomName.length >= 20) {
      return alert("Please enter a shorter name for the room");
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer dummy_token",
    };

    if (roomName) {
      axios
        .post(
          process.env.REACT_APP_ROOMS_SENDMSG_API,
          {
            profile_name: roomName,
            message_text: "",
            phone_number: roomNumber,
          },
          { headers }
        )
        .then((response) => {
          alert("Added successfully !!!");
        })
        .catch((error) => {
          alert("Can not able to Add, Try again.");
        });
    }
  };

  const matcher = (s, values) => {
    const re = RegExp(`.*${s.toLowerCase().split("").join(".*")}.*`);
    return values.filter(
      (v) => v.name.toLowerCase().match(re) || v.phone.toLowerCase().match(re)
    );
  };

  const handleChange = (e) => {
    setSidebarBool(false);
    setInput(e.target.value);
  };
  
  function logout() {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  }


  
  return (
    <>
      <div className="Sidebar">
        <div className="Sidebar__header">
          <Avatar src={adminPFP} />
          {/* <button onClick={handleOpen}  style={{border:"none" , backgroundColor:"#90EE90" , borderRadius:"5px", padding:"12px 12px", color:"black" , fontWeight:"bold", cursor:"pointer"}}>Notification</button>
          <Email_Select_Modal open={open} handleSelectEmail={handleSelectEmail} handleClose={handleClose} handleComposeEmail={handleComposeEmail}  />
          <Email_Modal open2={open2} handleClose={handleClose} emails={emails} handleReply={handleReply} handleComposeEmail={handleComposeEmail} />
          <Reply_Email open3={open3} email={replyEmail} setOpen3={setOpen3} />
          <Compose_Email open4={open4} email={selectedEmail} setOpen4={setOpen4} /> */}
          <div className="Sidebar__headerRight">
            <Tooltip title="Add Room">
              <AddCircleOutline onClick={createChat} />
            </Tooltip>

            <Tooltip title="Logout">
              <LogoutIcon onClick={logout} />
            </Tooltip>
          </div>
        </div>
        <Divider />
        <div className="Sidebar__search">
          <div className="Sidebar__searchContainer">
            <SearchRounded />
            <input
              placeholder="Search or Start New Chat"
              type="text"
              value={input}
              onChange={handleChange}
            />
            {input && (
              <Clear className="clear-icon" onClick={() => setInput("")} />
            )}
          </div>
        </div>
        <Divider />

        {rooms.length > 0 ? (
          sidebarBool ? (
            <div className="Sidebar__chats">
              {rooms.map((room, index) => (
                <div key={index}>
                  <Sidebarchat
                    addNewChat={true}
                    name={room.name}
                    text={room.text}
                    phone={room.phone}
                    message_count={room.message_count}
                    admin_unseen_count={room.admin_unseen_count}
                    timestamp={room.timestamp}
                    msg_status_code={room.msg_status_code?.toLowerCase()}
                    whatsapp_bussiness_number={room.whatsapp_bussiness_number}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats">
              {search.map((room, index) => (
                <div key={index}>
                  <Sidebarchat
                    addNewChat={true}
                    name={room.name}
                    text={room.text}
                    phone={room.phone}
                    message_count={room.message_count}
                    admin_unseen_count={room.admin_unseen_count}
                    timestamp={room.timestamp}
                    msg_status_code={room.msg_status_code?.toLowerCase()}
                    whatsapp_bussiness_number={room.whatsapp_bussiness_number}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="loading">
            <div className="gear"></div>
            <h2>LOADING CHATS</h2>
          </div>
        )}
      </div>
      <div className="selectMSG">SELECT USER TO VIEW MESSAGES</div>
    </>
  );
}

export default Sidebar;

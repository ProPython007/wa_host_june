import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send"; // Icon for sending messages
import AttachmentIcon from "@mui/icons-material/Attachment"; // Icon for sending documents
import ImageIcon from "@mui/icons-material/Image";
import MoodIcon from "@mui/icons-material/Mood";
import Videocam from "@mui/icons-material/Mood";
import { Add as PlusIcon } from "@mui/icons-material/Mood";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import { Avatar, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import db from "../firebase";
import "react-perfect-scrollbar/dist/css/styles.css";

import PerfectScrollbar from "react-perfect-scrollbar";

import { Download } from "@mui/icons-material";

import {
  AttachFile,
  InsertEmoticonOutlined,
  MicOutlined,
  MoreVert,
  Search,
  SearchRounded,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import "emoji-mart/css/emoji-mart.css"; // Import emoji-mart CSS
import EmojiPicker from "emoji-picker-react";
import { Cloudinary } from "cloudinary-core";
import { APIEndpoints } from "../api";
import { common } from "@mui/material/colors";

const urlParts = window.location.href.split("/");
const lastPart = urlParts[urlParts.length - 1];
const response = await axios.get(
  `https://django.casualfootwears.com/react/${lastPart}`
);
// console.log(lastPart)

let rMessages = response.data[0];
var chatResponse = 0;
let current_profile_name = "No Name"
// console.log(rMessages.profile_name)
function Chat() {
  let current_chat_phone_numbers = null;
  let current_chat_name = null;
  const chatContainerRef = useRef();
  const { room_id } = useParams();
  const [roomId, setRoomId] = useState(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    // Parse the URL to extract the room ID
    const urlParts = window.location.href.split("/");
    const lastPart = urlParts[urlParts.length - 1];

    // Check if the last part is a number (you can use a more robust validation if needed)
    if (!isNaN(lastPart)) {
      setRoomId(lastPart);
    }
  }, []);

  const [inputMessage, setInputMessage] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false); // Define setOpenEmojiPicker
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isNoDataDialogOpen, setNoDataDialogOpen] = useState(false);
  const [isNoDataDialogOpen2, setNoDataDialogOpen2] = useState(false);
  const [isUserData1Assign, setUserData1Assign] = (useState(false));
  const [isUserData2Assign, setUserData2Assign] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);
  const [userData, setUserData] = useState();
  const [userData2, setUserData2] = useState();
  const [search, setSearch] = useState([]);
  const [inputs, setInputs] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const [receivedMessages, setReceivedMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [timeMessages, settimeMessages] = useState({ timestamp: 0 }); // Initialize with a default timestamp

  const [selectedName, setSelectedName] = useState("");

  const [lastMessageTime, setLastMessageTime] = useState("");
  const [timeDifference, setTimeDifference] = useState("");

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // State to manage emoji picker visibility

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEmojiSelect = (event, emojiObject) => {
    setSelectedEmoji(emojiObject.emoji); // Store the selected emoji
    setInput((prevInput) => prevInput + emojiObject.emoji);
    // console.log(setInput);
    setOpenEmojiPicker(false);

    // let sym = e.unified.split("-");
    // let codesArray = [];
    // sym.forEach((el) => codesArray.push("0x" + el));
    // let emoji = String.fromCodePoint(...codesArray);
    // setInput(input + emoji);
    // Close the emoji picker
  };

  // Function to handle emoji selection and insert it into the message

  // Function to send a message
  // const sendMessage = () => {
  //   if (input.length > 0) {
  //     const newMessage = {
  //       name: "Admin", // Replace with the sender's name
  //       message: input,
  //       timestamp: new Date().toUTCString(),
  //     };
  //     const sendMessage = () => {
  //       if (input.length > 0) {
  //         const newMessage = {
  //           name: "Admin", // Replace with the sender's name
  //           message: input,
  //           timestamp: new Date().toUTCString(),
  //         };
  //         const sendingMessage = {
  //           "profile_name": "Admin",
  //           "message_text": input,
  //           "phone_number": rMessages.phone_number,

  //         }
  //         console.log(sendingMessage);
  //         console.log(input);

  //         axios.post('https://django.casualfootwears.com/react_rooms_sendmsg/', {
  //            sendingMessage
  //         })
  //           .then(response => {
  //             console.log(response.data);
  //           })
  //           .catch(error => {
  //             console.error(error);
  //           })
  //         setMessages([...messages, newMessage]);
  //         setInput("");
  //         setInputMessage('');
  //       }
  //     };
  //     setMessages([...messages, newMessage]);
  //     setInput("");
  //     setInputMessage('');
  //   }
  // };
  const openDialog = async () => {
    setDialogOpen(true);
    const num = window.location.href.slice(-10);
    try {
    const uR = await axios.get(
      `https://cors-anywhere.herokuapp.com/http://www.amdesi.com/order_json/${num}.json`
    );
    if (uR.status === 200) {
      const oData = uR.data;
      setUserData(oData);
      setUserData1Assign(true);
    }
  } catch (error) {
    setNoDataDialogOpen(true);
  }

  try {
    const uR1 = await axios.get(
      `https://www.ledshoes.in/order_json/${num}.json`
    );
    console.log(uR1);
    if (uR1.status === 200) {
      const oData = uR1.data;  // Corrected from uR.data to uR1.data
      setUserData(oData);
      setUserData1Assign(true);
    }
  } catch (error) {
    setNoDataDialogOpen(true);
  }
  
  try {
    const uR2 = await axios.get(
      `https://cors-anywhere.herokuapp.com/http://www.ledshoes.in/order_json/${num}.json`
    );
    if (uR2.status === 200) {
      const oData2 = uR2.data;
      setUserData2(oData2);
      setUserData2Assign(true);
    }
  } catch (error) {
    setNoDataDialogOpen2(true);
  }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setUserData({});
    setUserData1Assign(false);
    setNoDataDialogOpen(true);
    setUserData2({});
    setUserData2Assign(false);
    setNoDataDialogOpen2(true);
  };

  const handleSwitch = () =>{
    setIsSwitch(!isSwitch);
  }
  // const userData = {
  //   fullname: "Kittu",
  //   email: "kittuthammadi@gmail.com",
  //   telephone: "9121203007",
  //   telephone_2: "9121201007",
  //   account_type: "Guest",
  //   full_address: {
  //     address: "3-2-5/24 Near Badruka College, kachiguda \nTelangana 500027",
  //     pincode: "500027",
  //     city: "Hyderabad",
  //     state: "West Bengal",
  //   },
  //   orders: [
  //     {
  //       order_id: "69480",
  //       random_id: "F81-F69480887455",
  //       order_status: "OrderPlaced",
  //       payment_code: "cod",
  //       services: "BD,EC",
  //       repeat_order: "repeat",
  //       date_Time: "2023-11-22 04:01:16",
  //       ip: "182.68.240.207",
  //       mac_address: "",
  //       tracking_number: null,
  //       trackcode_date_time: null,
  //       tracking_Link: null,
  //       products: [
  //         {
  //           model: "Luminious Light Up Shoes",
  //           price: "10.0000",
  //           options: [
  //             {
  //               size: "7",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       order_id: "69479",
  //       random_id: "R82-P69479844352",
  //       order_status: "OrderPlaced",
  //       payment_code: "cod",
  //       services: "BD,EC",
  //       repeat_order: "repeat",
  //       date_Time: "2023-11-22 03:27:28",
  //       ip: "182.68.240.207",
  //       mac_address: "",
  //       tracking_number: null,
  //       trackcode_date_time: null,
  //       tracking_Link: null,
  //       products: [
  //         {
  //           model: "New Delux Cool Light Up Glow Sneakers",
  //           price: "899.0000",
  //           options: [
  //             {
  //               size: "6",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       order_id: "69478",
  //       random_id: "Y24-J69478818292",
  //       order_status: "OrderPlaced",
  //       payment_code: "cod",
  //       services: "BD,EC",
  //       repeat_order: "repeat",
  //       date_Time: "2023-11-22 03:23:00",
  //       ip: "182.68.240.207",
  //       mac_address: "",
  //       tracking_number: null,
  //       trackcode_date_time: null,
  //       tracking_Link: null,
  //       products: [
  //         {
  //           model: "Luminious Light Up Shoes",
  //           price: "10.0000",
  //           options: [
  //             {
  //               size: "7",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       order_id: "69475",
  //       random_id: "Q98-H69475175175",
  //       order_status: "OrderPlaced",
  //       payment_code: "cod",
  //       services: "BD,EC",
  //       repeat_order: "repeat",
  //       date_Time: "2023-11-21 07:06:26",
  //       ip: "182.68.240.207",
  //       mac_address: "",
  //       tracking_number: null,
  //       trackcode_date_time: null,
  //       tracking_Link: null,
  //       products: [
  //         {
  //           model: "Stylish Men and Women Light Up Shoes",
  //           price: "799.0000",
  //           options: [
  //             {
  //               size: "6",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // };

  // async function getMessage() {
  //   const urlParts = window.location.href.split("/");
  //   const lastPart = urlParts[urlParts.length - 1];
  //   const response = await axios.get(
  //     `https://django.casualfootwears.com/react/${lastPart}`
  //   );
  //   const receivedMessages = response.data;
  //   setReceivedMessages(receivedMessages);

  //   const chatNameElement = document.getElementById("chat_name");
  //   chatNameElement.textContent =
  //     receivedMessages[0].profile_name +
  //     " (" +
  //     receivedMessages[0].phone_number +
  //     ")";

  //     console.log(chatNameElement.textContent);

  //   const messages = receivedMessages.map((message) => ({
  //     name: message.profile_name,
  //     message: message.text,
  //     phone_number: message.phone_number,
  //     timestamp: message.timestamp,
  //     status: message.msg_status_code,
  //     media_upload: message.upload_media_path
  //       ? message.upload_media_path
  //           .replace("/home/lighbgsz/", "/")
  //           .replace("/home/lighvzkx/", "/")
  //       : null,
  //     admin_seen_count: message.admin_seen_count,
  //     message_id: message.message_id,
  //   }));
  //   return await messages;
  // }
  // const sendMessage = async () => {
  //   if (input.length > 0) {
  //     const newMessage = {
  //       name: "Admin", // Replace with the sender's name
  //       message: input,
  //       timestamp: new Date().toUTCString(),
  //     };
  //     (async () => {
  //       try {
  //         const whole_message = await getMessage();
  //         let sendingMessage = {
  //           profile_name:whole_message[0].profile_name,
  //           message_text: input,
  //           phone_number:  whole_message[0].phone_number,
  //         };
  //         console.log(sendingMessage);
  //       } catch (error) {
  //         console.error("Error:", error);
  //       }
  //     })();

  //     // Hard-coded data

  //     // console.log(sendingMessage);
  //     // console.log(input);

  //     // Prepare the headers
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer dummy_token',
  //     };

  //   console.log("this is");

  //     // Make the Axios POST request
  //     axios.post('https://django.casualfootwears.com/react_rooms_sendmsg/', sendingMessage, { headers })
  //       .then(response => {
  //         console.log(response.data);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });

  //     setMessages([...messages, newMessage]);
  //     setInput("");
  //     setInputMessage('');
  //   }
  // };

  const sendMessage = async () => {
    if (input.length > 0) {
      try {
        // const whole_message = await getMessage();
        // Prepare the sending message
        let sendingMessage = {
          profile_name: current_profile_name,
          message_text: input,
          phone_number: receivedMessages[0].phone_number,
        };
        // console.log(current_profile_name)
        // console.log("thisssss");
        // console.log(sendingMessage);
        setInput("");
        setInputMessage("");
        // Prepare the headers
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer dummy_token",
        };

        // Make the Axios POST request
        const response = await axios.post(
          "https://django.casualfootwears.com/react_rooms_sendmsg/",
          sendingMessage,
          { headers }
        );
        //console.log(response.data);

        // setMessages([...messages, newMessage]);
        // setInput("");
      } catch (error) {
        // console.error("Error:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the Enter key from creating a newline in the input field
      sendMessage();
    }
  };
  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };
  let url = null;

  // const url =message.upload_media_path.replace('/home/lighbgsz/', '/').replace('/home/lighbgsz/', '/');
  useEffect(() => {
    async function fetchMessages() {
      try {
        const urlParts = window.location.href.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        const response = await axios.get(
          `https://django.casualfootwears.com/react/${lastPart}`
        );
        const receivedMessages = response.data;
        setReceivedMessages(receivedMessages);

        const chatNameElement = document.getElementById("chat_name");
        chatNameElement.textContent =
          receivedMessages[0].profile_name +
          " (" +
          receivedMessages[0].phone_number +
          ")";

        const messages = receivedMessages.map((message) => ({
          name: message.profile_name,
          phone_number: message.phone_number,
          message: message.text,
          timestamp: message.timestamp,
          msg_status_comment: message.msg_status_comment,
          msg_status_code: message.msg_status_code,
          sent_by: message.message_text_sent_by,
          media_upload: message.upload_media_path
            ? message.upload_media_path.replace("/home/lighbgsz/", "")
            : null,
          admin_seen_count: message.admin_seen_count,
          message_id: message.message_id,
        }));
        const url = "https://django.casualfootwears.com/update_msg_seen"; // Replace with the actual URL of your API

        const data = {
          whatsapp_id: receivedMessages.message_id,
        };

        // update msg status to seen
        for (let index = 0; index < receivedMessages.length; index++) {
          const wp_msg_element = receivedMessages[index];
          current_profile_name = receivedMessages[index].profile_name;
          if (wp_msg_element.admin_seen_count == 0) {
            const data = {
              whatsapp_id: wp_msg_element.message_id,
            };    
            // console.log(wp_msg_element)
            axios.post(url,data)
            
          }
          
        }
        //console.log(data)
        // if((receivedMessages[0].admin_seen_count)==0){
        // fetch(url, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(data)
        // })
        //   .then((response) => {
        //     if (response.status === 200) {
        //       //console.log('Message marked as seen by admin successfully.');
        //     } else {
        //       console.log('Error:', response.status, response.statusText);
        //       return response.text();
        //     }
        //   })
        //   .then((responseData) => {
        //     // If needed, you can access the response data here.
        //   //  console.log('Response Data:', responseData);
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //});
        // }
        //console.log( receivedMessages[0])
        current_chat_name = receivedMessages[0].profile_name;
        current_chat_phone_numbers = receivedMessages[0].phone_number;
        //  console.log(current_chat_name);

        // Get the timestamp from the most recent message
        const rMessagesTimestamp =
          messages.length > 0 ? messages[0].timestamp : 0;
        setLastMessageTime(
          new Date(rMessagesTimestamp * 1000).toLocaleTimeString()
        );

        setNewMessages(messages.reverse());
        // scrollToBottom();
        const obj = {
          rMessagesTimestamp: rMessagesTimestamp,
          rLength: receivedMessages.length,
        };
        return obj; // Return the timestamp
      } catch (error) {
        console.error(error);
        return 0; // Return 0 or a default value in case of an error
      }
    }

    const intervalId = setInterval(() => {
      fetchMessages().then((obj) => {
        if (obj.rMessagesTimestamp !== 0) {
          // Calculate the time difference
          calculateTimeDifference(obj.rMessagesTimestamp);
        }
        if (chatResponse == 0 || obj.rLength > chatResponse) {
          scrollToBottom();
          chatResponse = obj.rLength;
        }
      });
    }, 800);

    // Example data

    function calculateTimeDifference(endingTime) {
      const inputTime = new Date(endingTime * 1000).toLocaleTimeString();
      // Convert input time to a Date object
      const endTime = new Date();
      const inputDate = new Date();

      const timeParts = inputTime.match(/(\d+):(\d+):(\d+) ([APap][mM])/);
      const hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const seconds = parseInt(timeParts[3]);
      const ampm = timeParts[4];
      inputDate.setHours(
        ampm.toLowerCase() === "pm" ? hours + 12 : hours,
        minutes,
        seconds,
        0
      );

      // Calculate the remaining time until 24 hours have passed
      const currentTimestamp = inputDate.getTime();

      // Get the current timestamp in milliseconds
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeDifferenceMilliseconds =
        twentyFourHours - (endTime - inputDate);

      const second = Math.floor((timeDifferenceMilliseconds / 1000) % 60);
      const minute = Math.floor(
        (timeDifferenceMilliseconds / (1000 * 60)) % 60
      );
      const hour = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60));

      const timeDifference = `${hour}:${minute}:${second}`;
      // console.log(timeDifference)
      setTimeDifference(timeDifference); // Update the displayed time

      // console.log(remainingSeconds);
    }

    return () => clearInterval(intervalId);
  }, []);
  //   // Map receivedMessages to new messages
  //   const newMessages = receivedMessages.map(message => ({
  //     name: message.profile_name,
  //     message: message.message_text,
  //     timestamp: message.timestamp,
  // }));
  // console.log(newMessages)
  //   return newMessages;
  // };

  // const receiveMessage =() => {
  //   try {
  //     const response =  axios.get('http://127.0.0.1:8000/message/');

  //     const receivedMessages = response.data;
  //     console.log(receivedMessages)
  //     const receivedMessagesJSON = JSON.stringify(receivedMessages);
  //     // console.log(receivedMessagesJSON);
  //     // console.log(receivedMessages);
  //     return receivedMessagesJSON;
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //     return '[]'; // Return an empty array as JSON in case of an error
  //   }
  // };
  // const [rawResponse, setRawResponse] = useState('');

  // useEffect(() => {
  //   async function getAllStudents() {
  //     try {
  //       const response = await axios.get('http://127.0.0.1:8000/message');
  //       setRawResponse(JSON.stringify(response.data, null, 2));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   getAllStudents();

  // }, []);
  // Function to handle emoji selection and insert it into the message input

  useEffect(() => {
    // Add a click event listener to close the emoji picker when clicking outside of it
    const handleOutsideClick = (event) => {
      if (
        openEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setOpenEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openEmojiPicker]); // Dependency added to trigger the effect when openEmojiPicker changes

  // Function to handle changes in the search input
  const handleInputChange = (e) => {
    setInputs(e.target.value);

    if (e.target.value === "") {
      setMessages([]);
    } else {
      // Filter messages based on the sender's name (mocking the search feature)
      const filteredMessages = messages.filter((message) =>
        message.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearch(filteredMessages);
    }
  };

  // Function to send a document
  // Function to send a document
  const sendDocument = () => {
    // Implement logic to send a document
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.accept = "application/docx";

    // Handle file selection
    fileInput.onchange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append("document", selectedFile);
        formData.append("profile_name", receivedMessages[0].profile_name);
        formData.append("phone_number", receivedMessages[0].phone_number);

        const header = {
          "Content-Type": "multipart/form-data",
        };
        // Send the FormData to the Django backend using axios
        axios
          .post(
            "https://django.casualfootwears.com/upload_media_document",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            const { media_id } = response.data;
            // Handle the media_id or any other response as needed
            //console.log('Document uploaded successfully');
            // console.log(response.data);
          })
          .catch((error) => {
            // Handle the error
            //console.error('Error uploading document', error);
          });

        // You can send the selected document to your backend or process it here
        // console.log('Selected document:', selectedFile.name);
        // Add logic to send the selected document to the chat
      }
    };

    // Trigger the file input dialog
    fileInput.click();
  };
  // const sendImage = () => {
  //   // Implement logic to send a document
  //   // For example, you can use an input[type="file"] to select a document file:

  //   const fileInput = document.createElement('input');
  //   fileInput.type = 'file';
  //   fileInput.accept = '.png'; // Specify the accepted file types (e.g., .pdf)

  //   // Handle file selection
  //   fileInput.onchange = (event) => {
  //     const selectedFile = event.target.files[0];

  //     if (selectedFile) {
  //       axios.post('https://django.casualfootwears.com/upload_media', { selectedFile })
  //     .then(response => {
  //       const { media_id } = response.data;
  //       // Handle the media_id or any other response as needed
  //     })
  //     .catch(error => {
  //       // Handle the error
  //     });
  //       // You can send the selected document to your backend or process it here
  //       console.log('Selected document:', selectedFile);
  //       // Add logic to send the selected document to the chat
  //     }
  //   };

  //   // Trigger the file input dialog
  //   fileInput.click();
  // };
  const sendImage = () => {
    // Create an input[type="file"] element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png";
    fileInput.accept = ".jpeg";
    fileInput.accept = ".jpg"; // Specify the accepted file types (e.g., .png)

    // Handle file selection
    fileInput.onchange = (event) => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("profile_name", receivedMessages[0].profile_name);
        formData.append("phone_number", receivedMessages[0].phone_number);
        // console.log(formData);

        // Send the FormData to the Django backend using axios
        axios
          .post("https://django.casualfootwears.com/upload_media", formData)
          .then((response) => {
            const { media_id } = response.data;
            // Handle the media_id or any other response as needed
            //  console.log('Image uploaded successfully');
            // console.log(response.data);
          })
          .catch((error) => {
            // Handle the error
            //console.error('Error uploading image', error);
          });

        // You can send the selected document to your backend or process it here
        // console.log('Selected document:', selectedFile.name);
        // Add logic to send the selected document to the chat
      }
    };

    // Trigger the file input dialog
    fileInput.click();
  };
  const sendVideo = () => {
    // Create an input[type="file"] element

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".mp4, .webp, .mov"; // Specify the accepted file types (e.g., .png)

    // Handle file selection
    fileInput.onchange = (event) => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append("video", selectedFile);
        formData.append("profile_name", receivedMessages[0].profile_name);
        formData.append("phone_number", receivedMessages[0].phone_number);
        //console.log(formData);

        // Send the FormData to the Django backend using axios
        axios
          .post(
            "https://django.casualfootwears.com/upload_media_video",
            formData
          )
          .then((response) => {
            const { media_id } = response.data;
            // Handle the media_id or any other response as needed
            //console.log('Image uploaded successfully');
            // console.log(response.data);
          })
          .catch((error) => {
            // Handle the error
            //console.error('Error uploading image', error);
          });

        // You can send the selected document to your backend or process it here
        //console.log('Selected document:', selectedFile.name);
        // Add logic to send the selected document to the chat
      }
    };

    // Trigger the file input dialog
    fileInput.click();
  };

  // Function to send an image
  // Function to send an image
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to handle image selection
  const handleImageSelect = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
  };

  // // Function to handle sending an image
  // const sendImage = async (imageFile) => {
  //   if (imageFile) {
  //     const formData = new FormData();
  //     formData.append('image', imageFile);

  //     try {
  //       const response = await fetch('https://your-api-url/upload-image', {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         // `data.imageUrl` or a similar field in your API response contains the URL of the uploaded image
  //         const imageUrl = data.imageUrl;

  //         // Now you can use imageUrl to do something with the uploaded image URL, like saving it to your database or displaying it in your application.
  //         console.log('Image uploaded successfully. URL:', imageUrl);
  //       } else {
  //         console.error('Error uploading image:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //     }
  //   }
  // };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  function scrollToBottom() {
    const chatContainer = document.querySelector(".Chat__body");
    // console.log("scroll");
    // Scroll to the bottom of the container
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  const handleDropdownItemClick = (action) => {
    // Perform the action associated with the clicked item here
    if (action === "emoji") {
      // Handle emoji picker
    } else if (action === "document") {
      sendDocument();

      // Handle document sending
    } else if (action === "image") {
      sendImage();
    } else if (action === "video") {
      sendVideo();
    }
    // Close the dropdown after performing the action
    setShowDropdown(false);
  };
  const handleTemplate = (event) => {
    const selectedTemplate = event.target.value;

    if (selectedTemplate === "Photo") {
      sendImage();
      // Code to handle the Photo Template selection
    } else if (selectedTemplate === "Video") {
      // Code to handle the Video Template selection
    } else if (selectedTemplate === "Document") {
      // Code to handle the Document Template selection
      openDocumentTemplate(); // Call your function to handle the Document Template
    } else if (selectedTemplate === "Location") {
      // Code to handle the Location Template selection
    }
    // Add additional else if branches as needed for more templates.
  };

  const openDocumentTemplate = () => {};

  // function calculateTimeDifference(endingTime) {
  //   const inputTime =  new Date(endingTime * 1000).toLocaleTimeString();
  //   // Convert input time to a Date object
  //   const inputDate = new Date();
  //   const timeParts = inputTime.match(/(\d+):(\d+):(\d+) ([APap][mM])/);
  //   const hours = parseInt(timeParts[1]);
  //   const minutes = parseInt(timeParts[2]);
  //   const seconds = parseInt(timeParts[3]);
  //   const ampm = timeParts[4];
  //   inputDate.setHours(ampm.toLowerCase() === 'pm' ? hours + 12 : hours, minutes, seconds, 0);

  //   // Calculate the remaining time until 24 hours have passed
  //   const currentTimestamp = inputDate.getTime(); // Get the current timestamp in milliseconds
  //   const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  //   const remainingMilliseconds = twentyFourHours - (currentTimestamp % twentyFourHours);
  //   const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
  //   console.log(remainingSeconds);
  //   setTimeDifference(remainingSeconds);
  //   // const startTime = new Date(time* 1000).getTime() / 1000;
  //   // const endTime = new Date(endingTime).getTime() / 1000; // Convert to seconds
  //   // const timeDifferenceInSeconds = Math.abs(endTime - startTime)/1000;
  //   // const twentyFourHoursAgo = new Date().getTime() / 1000 - 24 * 60 * 60;
  //   // return remainingSeconds;
  // }
  // const intervalId = setInterval(calculateTimeDifference(), 1000);

  // Initial update
  // const receivedMessages = receiveMessage();
  // const newMessages = [];
  // console.log(receivedMessages);
  // for (let i = 0; i < receivedMessages.length; i++) {
  //   const message = receivedMessages[i];
  //   console.log(receivedMessages);
  //   console.log("hi");
  //   newMessages.push({
  //     name: message.profile_name,
  //     message: message.message_text,
  //     timestamp: message.timestamp,
  //   });
  // }
  // console.log(newMessages);
  const handleNameChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedName(selectedValue);
    if (selectedValue === "Photo") {
      // Call the function for the 'Photo' option
      sendImage();
    } else if (selectedValue === "Video") {
      // Call the function for the 'Video' option
      sendImage();
    } else if (selectedValue === "Document") {
      // Call the function for the 'Document' option
      sendDocument();
    } else if (selectedValue === "Location") {
      // Call the function for the 'Location' option
    } else {
      // Handle the default case, e.g., when no option is selected
    }
  };

  // newMessages.map((message, index) => {
  //   const fetchData = async () => {
  //     try {
  //       const url = "https://django.casualfootwears.com/update_msg_seen";
  //       const data = { whatsapp_id: message.message_id };
  //       if (message.admin_seen_count == 0) {
  //         const response = await fetch(url, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(data),
  //         });
  //       }

  //       const responseData = await response.json();

  //       if (response.ok) {
  //         // console.log('Message marked as seen by admin successfully:', responseData);
  //         // Handle success as needed
  //       } else {
  //         //console.error('Error:', response.status, responseData);
  //         // Handle error as needed
  //       }
  //     } catch (error) {
  //       //console.error('Error:', error);
  //     }
  //   };
  //   fetchData();
  // });

  // You may want to return some JSX here based on your requirements

  return (
    <div className="Chat" key={room_id} ref={chatContainerRef}>
      <div className="Chat__header">
        <div className="small-window-with-scroll">
          {/* Button to open the dialog */}
          <button onClick={openDialog}>Open Dialog</button>

          {/* Dialog Box */}
          {isDialogOpen && (
            <div className="dialog-overlay">
              <div className="dialog-content">
                {/* Close button */}
                <button className="close-button" onClick={closeDialog}>
                  Close
                </button>
                {isSwitch ? (
                  <div className="mainContent1">
                    <button className="close-button" onClick={handleSwitch}>
                      Switch to LED Shoes
                    </button>
                    <h1>AMDESI</h1>
                    {isUserData1Assign ? (
                      <div>
                        {/* User Details Table */}
                        <table className="user-details-table">
                          <thead>
                            <tr>
                              <th>Field Name</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(userData).map(
                              ([fieldName, value]) =>
                                fieldName !== "orders" && (
                                  <tr key={fieldName}>
                                    <td>{fieldName}</td>
                                    <td>
                                      {fieldName === "full_address" ? (
                                        <div>
                                          <div>
                                            <strong>Address:</strong>{" "}
                                            {value.address}
                                          </div>
                                          <div>
                                            <strong>Pincode:</strong>{" "}
                                            {value.pincode}
                                          </div>
                                          <div>
                                            <strong>City:</strong> {value.city}
                                          </div>
                                          <div>
                                            <strong>State:</strong>{" "}
                                            {value.state}
                                          </div>
                                        </div>
                                      ) : typeof value === "object" ? (
                                        JSON.stringify(value)
                                      ) : (
                                        value
                                      )}
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>

                        {/* Orders Table */}
                        {Object.keys(userData.orders[0]).map((titleColumn) =>
                          titleColumn != "products" ? (
                            <tr>
                              <th>{titleColumn}</th>
                              <td>
                                {userData.orders.map((order) => (
                                  <p>
                                    {String(order[titleColumn]) === "null"
                                      ? ""
                                      : String(order[titleColumn])}
                                  </p>
                                ))}
                              </td>
                              {/* {console.log(orders[])} */}
                            </tr>
                          ) : (
                            ["model", "price", "size"].map((productTitle) => (
                              <tr>
                                <th>{productTitle}</th>
                                <td>
                                  {productTitle != "size"
                                    ? userData.orders.map((order) => (
                                        <p>{order.products[0][productTitle]}</p>
                                      ))
                                    : userData.orders.map((order) => (
                                        <p>
                                          {
                                            order.products[0].options[0][
                                              productTitle
                                            ]
                                          }
                                        </p>
                                      ))}
                                </td>
                              </tr>
                            ))
                          )
                        )}
                      </div>
                    ) : (
                      isNoDataDialogOpen && <p>No data found</p>
                    )}
                  </div>
                ) : (
                  <div className="mainContent2">
                    <button className="close-button" onClick={handleSwitch}>
                      Switch to Amdesi
                    </button>
                    <h1>LED SHOE</h1>
                    {isUserData2Assign ? (
                      <div>
                        {/* User Details Table */}
                        <table className="user-details-table">
                          <thead>
                            <tr>
                              <th>Field Name</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(userData).map(
                              ([fieldName, value]) =>
                                fieldName !== "orders" && (
                                  <tr key={fieldName}>
                                    <td>{fieldName}</td>
                                    <td>
                                      {fieldName === "full_address" ? (
                                        <div>
                                          <div>
                                            <strong>Address:</strong>{" "}
                                            {value.address}
                                          </div>
                                          <div>
                                            <strong>Pincode:</strong>{" "}
                                            {value.pincode}
                                          </div>
                                          <div>
                                            <strong>City:</strong> {value.city}
                                          </div>
                                          <div>
                                            <strong>State:</strong>{" "}
                                            {value.state}
                                          </div>
                                        </div>
                                      ) : typeof value === "object" ? (
                                        JSON.stringify(value)
                                      ) : (
                                        value
                                      )}
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>

                        {/* Orders Table */}
                        {Object.keys(userData2.orders[0]).map((titleColumn) =>
                          titleColumn != "products" ? (
                            <tr>
                              <th>{titleColumn}</th>
                              <td>
                                {userData2.orders.map((order) => (
                                  <p>
                                    {String(order[titleColumn]) === "null"
                                      ? ""
                                      : String(order[titleColumn])}
                                  </p>
                                ))}
                              </td>
                              {/* {console.log(orders[])} */}
                            </tr>
                          ) : (
                            ["model", "price", "size"].map((productTitle) => (
                              <tr>
                                <th>{productTitle}</th>
                                <td>
                                  {productTitle != "size"
                                    ? userData2.orders.map((order) => (
                                        <p>{order.products[0][productTitle]}</p>
                                      ))
                                    : userData2.orders.map((order) => (
                                        <p>
                                          {
                                            order.products[0].options[0][
                                              productTitle
                                            ]
                                          }
                                        </p>
                                      ))}
                                </td>
                              </tr>
                            ))
                          )
                        )}
                      </div>
                    ) : (
                      isNoDataDialogOpen2 && <p>No data found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="Chat__headerinfo">
          <h3 id="chat_name">
            {rMessages.profile_name} ({rMessages.phone_number})
          </h3>
          {/* <p >
         
          Time since last message: {timeDifference}
      </p> */}
        </div>
        <div className="Chat__headerright">
          <select
            style={{
              fontFamily: "Open sans",
              borderRadius: "20px",
              backgroundColor: "#fffff",
              color: "black",
              outline: "none",
            }}
            value={selectedName}
            onChange={handleNameChange}
          >
            <option value="" style={{ fontWeight: "bold" }}>
              Select a Template
            </option>
            <option value="Photo">Photo Template</option>
            <option value="Video">Video Template</option>
            <option value="Document">Document Template</option>
            <option value="Location">Location Template</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <div className="Chat__body">
        {newMessages.map((message, index) =>
          message.message.length > 0 ? (
            <div
              className={`Chat__Messages msgFrom${
                message.sent_by === "DJANGO ADMIN" ? "Chat__Reciver" : ""
              }`}
              key={index}
            >
              {/* <span className="Chat__Date" >
          {new Date(message.timestamp*1000).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        })}
        </span> */}
              {/* {message.admin_seen_count === 0 && (
            const url = 'https://django.casualfootwears.com/update_msg_seen';
        const data = {
          whatsapp_id: message.message_id
        };

        console.log(data)

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }))
          } */}
              <span className="Chat__MessageContent">
                {message.message}
                {/* {console.log(message.message_id)} */}
                <span className="Chat__Time">
                  {new Date(message.timestamp * 1000).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  )}{" "}
                  at{" "}
                  {new Date(message.timestamp * 1000).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <div>
                  <span className="Chat__DateTime"></span>
                </div>

                <span className="tick_font">
                  {message.msg_status_code === "read" && (
                    <span className="BlueTick">✓✓</span>
                  )}
                  {message.msg_status_code === "sent" && (
                    <span className="WhiteTick">✓</span>
                  )}
                  {message.msg_status_code === "delivered" && (
                    <span className="WhiteTick">✓✓</span>
                  )}
                  {message.msg_status_code === "failed" && (
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {message.msg_status_comment}
                      </span>

                      <span className="RedTick">🚫</span>
                    </div>
                  )}
                </span>
              </span>
              {/* </span>
               */}
            </div>
          ) : (
            <div
              className={`Chat__Messages media msgFrom${
                message.sent_by === "DJANGO ADMIN" ? "Chat__Reciver" : ""
              }`}
              key={index}
            >
              {/* <span className="Chat__Date">
                {new Date(message.timestamp*1000).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })} 
                </span> */}
              {message.media_upload ? (
                message.media_upload.split(".").pop().toLowerCase() === "png" ||
                message.media_upload.split(".").pop().toLowerCase() === "jpg" ||
                message.media_upload.split(".").pop().toLowerCase() ===
                  "jpeg" ? (
                  <div>
                    <div className="imgNtd">
                      <img
                        src={`https://${message.media_upload}`}
                        alt="Media"
                        className="Chat__MessageImage"
                      />
                      <span className="Chat__Time">
                        {new Date(message.timestamp * 1000).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(message.timestamp * 1000).toLocaleTimeString(
                          [],
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                      <span className="tick_font">
                        {message.msg_status_code.toLowerCase() === "read" && (
                          <span className="BlueTick">✓✓</span>
                        )}

                        {message.msg_status_code === "sent" && (
                          <span className="WhiteTick">✓</span>
                        )}
                        {message.msg_status_code === "delivered" && (
                          <span className="WhiteTick">✓✓</span>
                        )}
                        {message.msg_status_code === "failed" && (
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {message.msg_status_comment}
                            </span>

                            <span className="RedTick">✓</span>
                          </div>
                        )}
                      </span>
                      <a
                        href={`https://${message.media_upload}`}
                        download={message.media_upload.split("/").slice(-1)[0]}
                      >
                        {/* <IconButton>
                          <Download />
                        </IconButton> */}
                        <span className="btn">Download</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <span className="Chat__MessageContent">
                    <a href={`https://${message.media_upload}`} target="_blank">
                      {message.media_upload.split("/").slice(-1)[0]}
                    </a>
                    <p></p>
                    <a
                      href={`https://${message.media_upload}`}
                      download={message.media_upload.split("/").slice(-1)[0]}
                    >
                      Download
                    </a>
                  </span>
                )
              ) : null}

              <div></div>

              {/* </span>
               */}
            </div>
          )
        )}

        {/* {inputs.length > 0 ? (
    search.map((message, index) => (
      <div className={`Chat__Messages ${message.name === "User1" && "Chat__Reciver"}`} key={index}>
        <span className="Chat__Name">{message.name}</span>
        <br />
        <span className="Chat__MessageContent">{message.message}</span>
        <div>
          <span className="Chat__DateTime">
            <span className="Chat__Time">{new Date(message.timestamp).toLocaleTimeString()}</span>
            <span className="Chat__Date">{new Date(message.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>
          </span>
        </div>
      </div>
    ))
  ) : (
    messages.map((message, index) => (
      <div className={`Chat__Messages ${message.name === "User1" && "Chat__Reciver"}`} key={index}>
        <span className="Chat__Name">{message.name}</span>
        <br />
        <span className="Chat__MessageContent">{message.message}</span>
        <div>
          <span className="Chat__DateTime">
            <span className="Chat__Time">{new Date(message.timestamp).toLocaleTimeString()}</span>
            <span className="Chat__Date">{new Date(message.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>
          </span>
        </div>
      </div>
    ))
 ) } */}
      </div>

      <div className="Chat__footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          onKeyPress={handleKeyPress}
          // style={{ width: "900px", height: "60px" }}
        />

        <div className="chatFooterElements">
          <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <span className="plus-icon">+</span>
            </button>
            {showDropdown && (
              <div
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("document")}
                >
                  <AttachmentIcon /> Send Document
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("video")}
                >
                  <VideoCallIcon /> Send Video
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("image")}
                >
                  <ImageIcon /> Send Image
                </span>
              </div>
            )}
          </div>
          {/* <button onClick={() => setOpenEmojiPicker(true)}> */}
          <div
            className="emojiIcon"
            onClick={() => {
              setOpenEmojiPicker(!openEmojiPicker);
            }}
          >
            {openEmojiPicker && (
              <div className="emoji-picker-container">
                {/* {console.log(emoji)} */}
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
            <MoodIcon />
          </div>

          <div>
            <SendIcon className="icon" onClick={sendMessage} />{" "}
            {/* Send Message */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

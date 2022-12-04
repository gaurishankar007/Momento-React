import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoggedInHeader from "./Header/LoggedInHeader";
import { io } from "socket.io-client";
import "../css/Chat.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const socket = io("ws://localhost:5501");

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("addUser", localStorage.getItem("userToken"));
    socket.on("getUsers", (users) => {
      console.log(users);
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <LoggedInHeader></LoggedInHeader>
      <div id="message-container"></div>
      <form id="form" action="">
        <input
          id="input"
          autoComplete="off"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit" onClick={handleSubmit}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

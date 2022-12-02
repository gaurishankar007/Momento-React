import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoggedInHeader from "./Header/LoggedInHeader";
import { io } from "socket.io-client";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Chat = () => {
  return (
    <div>
      <LoggedInHeader></LoggedInHeader>
    </div>
  );
};

export default Chat;

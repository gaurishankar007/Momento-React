import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoggedInHeader from "./Header/LoggedInHeader";
import { io } from "socket.io-client";
import "../css/Chat.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("userToken"),
  },
};
const socket = io("ws://localhost:4040");

const Chat = () => {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(async () => {
    const chatData = await axios.get(
      `${REACT_APP_BASE_URL}chats/fetch`,
      config
    );

    setChats(chatData.data);
    accessMessages(chatData.data[0]);
  }, []);

  const accessChat = async (userId) => {
    const chatData = await axios.post(
      `${REACT_APP_BASE_URL}chat/access`,
      {
        user_id: userId,
      },
      config
    );

    const newChats = chats;
    var addChat = true;
    chats.forEach((element) => {
      if (element._id === chatData.data._id) {
        addChat = false;
      }
    });

    if (addChat) {
      newChats.push(chatData.data);
      setChats([]);
      setChats(newChats);
    }

    accessMessages(chatData);
  };

  const accessMessages = async (chatData) => {
    const messages = await axios.post(
      `${REACT_APP_BASE_URL}message/fetchAll`,
      { chat_id: chatData._id },
      config
    );

    setSelectedChat(chatData);
    setChatMessages(messages.data);
  };

  const sendMessage = async () => {
    if (content === "") {
      return;
    }

    const message = await axios.post(
      `${REACT_APP_BASE_URL}message/send`,
      { chat_id: selectedChat._id, content: content },
      config
    );

    setContent("");
  };

  const searchUser = (username) => {
    if (username.trim() === "") {
      setSearchedUsers([]);
      return;
    }

    axios
      .post(
        `${REACT_APP_BASE_URL}user/search/username`,
        { parameter: username },
        config
      )
      .then((response) => {
        setSearchedUsers(response.data);
      });
  };

  return (
    <div>
      <LoggedInHeader></LoggedInHeader>
      <div id="container">
        <aside>
          <header>
            <div className="input-group dropdown">
              <input
                type="text"
                placeholder="search"
                id="searchUser-input"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onChange={(e) => {
                  searchUser(e.target.value);
                }}
              />
              <ul
                className="dropdown-menu p-2"
                aria-labelledby="searchUser-input"
                id="searched-user"
              >
                {searchedUsers.map((singleUser) => {
                  return (
                    <button
                      className="d-flex justify-content-start align-items-center my-2"
                      key={singleUser._id}
                      style={{ border: "none" }}
                      onClick={() => {
                        accessChat(singleUser._id);
                      }}
                    >
                      <img
                        className="profile-pic me-3"
                        src={REACT_APP_PROFILE_PIC_URL + singleUser.profile_pic}
                        alt="ProfilePic"
                      />
                      <div className="d-flex flex-column align-items-start">
                        <h2>{singleUser.username}</h2>
                        <h4>{singleUser.email}</h4>
                      </div>
                    </button>
                  );
                })}
              </ul>
            </div>
          </header>
          <ul>
            {chats.length > 0 ? (
              chats.map((singleChat) => {
                return (
                  <li
                    key={singleChat._id}
                    className="d-flex justify-content-start align-items-center"
                    onClick={() => {
                      accessMessages(singleChat);
                    }}
                    style={{
                      backgroundColor:
                        singleChat._id === selectedChat._id
                          ? "lightskyblue"
                          : "transparent",
                    }}
                  >
                    <img
                      src={`${REACT_APP_PROFILE_PIC_URL}${singleChat.users[1].profile_pic}`}
                      alt=""
                    />
                    <div>
                      <h2>{singleChat.users[1].username}</h2>
                      <h3>
                        <span className="status orange"></span>
                        offline
                      </h3>
                    </div>
                  </li>
                );
              })
            ) : (
              <h2
                style={{ color: "white", fontSize: "20px", margin: "0 auto" }}
              >
                No Chats yet
              </h2>
            )}
          </ul>
        </aside>
        {chats.length > 0 ? (
          <main>
            {chatMessages.length > 0 ? (
              <ul id="chat">
                <li className="you">
                  <h3>10:12AM, Today</h3>
                  <div className="d-flex align-items-center">
                    <img
                      src={`https://www.bhaktiphotos.com/wp-content/uploads/2018/04/Mahadev-Bhagwan-Photo-for-Devotee.jpg`}
                      alt=""
                      style={{
                        height: "40px",
                        width: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="message">
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                      Aenean commodo ligula eget dolor.
                    </div>
                  </div>
                </li>
                <li className="me">
                  <h3>10:12AM, Today</h3>
                  <div className="message">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean commodo ligula eget dolor.
                  </div>
                </li>
              </ul>
            ) : (
              <ul
                id="chat"
                className="d-flex flex-column justify-content-end align-items-center"
              >
                <h2
                  style={{
                    fontSize: "13px",
                    color: "grey",
                    marginBottom: "20px",
                  }}
                >
                  Say hi to
                </h2>
              </ul>
            )}

            <div id="form" action="">
              <input
                id="input"
                autoComplete="off"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  sendMessage();
                }}
              >
                Send
              </button>
            </div>
          </main>
        ) : (
          <main>
            <h1 style={{ textAlign: "center" }}>No chats yet</h1>
          </main>
        )}
      </div>
    </div>
  );
};

export default Chat;

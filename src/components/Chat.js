import { useEffect, useState } from "react";
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
const user = localStorage.getItem("userData");
const userData = JSON.parse(user);
const socket = io("ws://localhost:4040");

const Chat = () => {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState("");

  useEffect(async () => {
    const chatData = await axios.get(
      `${REACT_APP_BASE_URL}chats/fetch`,
      config
    );

    setChats(chatData.data);
    accessMessages(chatData.data[0]._id);

    const chatUsers = [];
    for (let i = 0; i < chatData.data.length; i++) {
      const id = chatData.data[i].users.filter(
        (singleUser) => singleUser._id !== userData._id
      )[0]._id;

      chatUsers.push(id);
    }

    setInterval(() => {
      socket.emit("setup", { onlineUsers: chatUsers, userId: userData._id });
    }, 1000);

    setTimeout(() => {
      const messageContainer = document.getElementById("chat");
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }, 1000);
  }, []);

  useEffect(() => {
    socket.on("online", (userId) => {
      console.log(userId);
      const temp = online;

      if (!temp.includes(userId)) {
        temp.push(userId);
      }

      setOnline([]);
      setOnline(temp);
    });

    socket.on("typing", (profile) => {
      setIsTyping(profile);

      const messageContainer = document.getElementById("chat");
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    socket.on("stop typing", () => setIsTyping(""));

    socket.on("message received", (message) => {
      const messageContainer = document.getElementById("chat");
      const divElement = document.createElement("li");
      divElement.setAttribute("class", "you");

      const imgElement = document.createElement("img");
      imgElement.setAttribute("class", "profile-pic");
      imgElement.setAttribute(
        "src",
        REACT_APP_PROFILE_PIC_URL + message.sender.profile_pic
      );

      const textElement = document.createElement("div");
      textElement.setAttribute("class", "message");
      textElement.innerText = message.content;

      divElement.appendChild(imgElement);
      divElement.appendChild(textElement);
      messageContainer.appendChild(divElement);

      messageContainer.scrollTop = messageContainer.scrollHeight;
    });
  }, []);

  const accessChat = async (user) => {
    const chatData = await axios.post(
      `${REACT_APP_BASE_URL}chat/access`,
      {
        user_id: userData._id,
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

  const accessMessages = async (chatId) => {
    socket.emit("join chat", chatId);

    const messages = await axios.post(
      `${REACT_APP_BASE_URL}message/fetchAll`,
      { chat_id: chatId },
      config
    );

    setSelectedChatId(chatId);
    setChatMessages(messages.data);
  };

  const typing = (content) => {
    if (content === "") {
      socket.emit("stop typing", selectedChatId);
      setContent(content);
      setIsTyping("");
      return;
    }

    setContent(content);
    socket.emit("typing", {
      room: selectedChatId,
      profile: userData.profile_pic,
    });
  };

  const sendMessage = async () => {
    if (content === "") {
      return;
    }

    socket.emit("stop typing", selectedChatId);
    setIsTyping("");

    const message = await axios.post(
      `${REACT_APP_BASE_URL}message/send`,
      { chat_id: selectedChatId, content: content },
      config
    );

    displayMessage(content);
    socket.emit("new message", {
      message: message.data,
      room: selectedChatId,
    });
    setContent("");
  };

  const displayMessage = (content) => {
    const messageContainer = document.getElementById("chat");
    const divElement = document.createElement("li");
    divElement.setAttribute("class", "me");

    const textElement = document.createElement("div");
    textElement.setAttribute("class", "message");
    textElement.innerText = content;

    divElement.appendChild(textElement);
    messageContainer.appendChild(divElement);

    messageContainer.scrollTop = messageContainer.scrollHeight;
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
                      accessMessages(singleChat._id);
                    }}
                    style={{
                      backgroundColor:
                        singleChat._id === selectedChatId
                          ? "lightskyblue"
                          : "transparent",
                    }}
                  >
                    <img
                      src={`${REACT_APP_PROFILE_PIC_URL}${
                        singleChat.users.filter(
                          (singleUser) => singleUser._id !== userData._id
                        )[0].profile_pic
                      }`}
                      alt=""
                    />
                    <div>
                      <h2>
                        {
                          singleChat.users.filter(
                            (singleUser) => singleUser._id !== userData._id
                          )[0].username
                        }
                      </h2>
                      {online.includes(
                        singleChat.users.filter(
                          (singleUser) => singleUser._id !== userData._id
                        )[0]._id
                      ) ? (
                        <h3>
                          <span className="status green"></span>
                          online
                        </h3>
                      ) : (
                        <h3>
                          <span className="status orange"></span>
                          offline
                        </h3>
                      )}
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
                {chatMessages.map((singleChatMessage) => {
                  return singleChatMessage.sender._id !== userData._id ? (
                    <li
                      className="you d-flex align-items-center"
                      key={singleChatMessage._id}
                    >
                      <img
                        src={`${REACT_APP_PROFILE_PIC_URL}${singleChatMessage.sender.profile_pic}`}
                        alt=""
                        style={{
                          height: "40px",
                          width: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="message">{singleChatMessage.content}</div>
                    </li>
                  ) : (
                    <li className="me" key={singleChatMessage._id}>
                      <div className="message">{singleChatMessage.content}</div>
                    </li>
                  );
                })}
                {isTyping !== "" ? (
                  <li className="you d-flex align-items-center">
                    <img
                      src={REACT_APP_PROFILE_PIC_URL + isTyping}
                      alt=""
                      style={{
                        height: "40px",
                        width: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="message">typing....</div>
                  </li>
                ) : (
                  <div></div>
                )}
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
                  Say hi
                </h2>
              </ul>
            )}

            <div id="form" action="">
              <input
                id="input"
                autoComplete="off"
                value={content}
                onChange={(e) => {
                  typing(e.target.value);
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

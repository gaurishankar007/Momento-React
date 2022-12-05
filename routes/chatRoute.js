// Importing installed packages.....
const express = require("express");
const router = express.Router();

// Importing self made js files.....
const chat = require("../models/chatModel.js");
const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");

router.post("/chat/access", auth.verifyUser, async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var findChat = await chat
    .find({
      group: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userInfo._id } } },
        { users: { $elemMatch: { $eq: user_id } } },
      ],
    })
    .populate("users", "username profile_pic") // joining chat collection with user collection as the user collection is referenced in chat collection
    .populate("latest_message");

  findChat = await user.populate(findChat, {
    // populating again but for the sender of latestMessage which is already populated above
    path: "latest_message.sender",
    select: "username profile_pic",
  });

  if (findChat.length > 0) {
    res.send(findChat[0]);
  } else {
    const chatData = {
      chatName: "Sender",
      group: false,
      users: [req.userInfo._id, user_id],
    };

    try {
      const createChat = await chat.create(chatData);
      const fullChat = await chat
        .findOne({ _id: createChat._id })
        .populate("users", "+ username profile_pic email");
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

router.get("/chats/fetch", auth.verifyUser, async (req, res) => {
  try {
    chat
      .find({ users: { $elemMatch: { $eq: req.userInfo._id } } })
      .populate("users", "username profile_pic")
      .populate("admin", "username profile_pic")
      .populate("latest_message")
      .sort({ updatedAt: -1 })
      .then(async (chatData) => {
        chatData = await user.populate(chatData, {
          path: "latest_message.sender",
          select: "username profile_pic",
        });
        res.status(200).send(chatData);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

router.post("/groupChat/create", auth.verifyUser, async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send({ message: "please fill up all of the fields at first." });
  }

  var users = req.body.users;
  if (users.length < 2) {
    return res
      .status(400)
      .send("Requires more than 2 users to form a group chat.");
  }
  users.push(req.userInfo._id);

  try {
    const groupChat = await chat.create({
      name: req.body.name,
      users: users,
      group: true,
      admin: req.userInfo._id,
    });

    const fullGroupChat = await chat
      .findOne({ _id: groupChat._id })
      .populate("users", "username profile_pic")
      .populate("admin", "username profile_pic");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

router.put("/groupChat/rename", auth.verifyUser, async (req, res) => {
  const { chat_id, chat_name } = req.body;

  const updateChat = await chat
    .findByIdAndUpdate(chat_id, { name: chat_name }, { new: true })
    .populate("users", "username profile_pic")
    .populate("admin", "username profile_pic");

  if (!updateChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.status(200).send(updateChat);
  }
});

router.put("/groupChat/addUser", auth.verifyUser, async (req, res) => {
  const { chat_id, user_id } = req.body;

  const addToChat = await chat
    .findByIdAndUpdate(
      chat_id,
      {
        $push: { users: user_id },
      },
      { new: true }
    )
    .populate("users", "username profile_pic")
    .populate("admin", "username profile_pic");

  if (!addToChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.status(200).send(addToChat);
  }
});

router.put("/groupChat/removeUser", auth.verifyUser, async (req, res) => {
  const { chat_id, user_id } = req.body;

  const removeFromChat = await chat
    .findByIdAndUpdate(
      chat_id,
      {
        $pull: { users: user_id },
      },
      { new: true }
    )
    .populate("users", "username profile_pic")
    .populate("admin", "username profile_pic");

  if (!removeFromChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.status(200).send(removeFromChat);
  }
});

module.exports = router;

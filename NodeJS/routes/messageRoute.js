// Importing installed packages.....
const express = require("express");
const router = express.Router();

// Importing self made js files.....
const message = require("../models/messageModel.js");
const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");
const chat = require("../models/chatModel.js");

router.post("/message/send", auth.verifyUser, async (req, res)=> {
    const {content, chat_id} = req.body;

    if(!content || !chat_id) {
        console.log("Invalid data passed");
        res.sendStatus(400);
    }

    try {
        var newMessage = await message.create({
            sender: req.userInfo._id,
            content: content,
            chat_id: chat_id,
        });

        newMessage = await newMessage.populate("sender", "username profile_pic email");
        newMessage = await newMessage.populate("chat_id");
        newMessage = await user.populate(newMessage, {
            path: "chat_id.users",
            select: "username profile_pic email"
        });

        await chat.findByIdAndUpdate(chat_id, {latest_message: newMessage._id});
        res.json(newMessage);
    }
    catch(error) {
        res.status(400);
        throw new Error(error.message);
    }
});

router.post("/message/fetchAll", auth.verifyUser, async (req, res)=> {
    try{
        const messages = await message.find({chat_id: req.body.chat_id})
        .populate("sender", "username profile_pic email")
        .populate("chat_id");

        res.json(messages);
    }
    catch(error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = router;


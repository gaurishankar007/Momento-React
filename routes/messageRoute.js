// Importing installed packages.....
const express = require("express");
const router = express.Router();

// Importing self made js files.....
const message = require("../models/messageModel.js");
const user = require("../models/user");
const auth = require("../auth/auth.js");
const chat = require("../models/chatModel.js");

router.post("/message/send", auth.verifyUser, (req, res)=> {

});

module.exports = router;


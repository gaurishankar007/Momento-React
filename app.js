const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+"/uploads"))

require("./database/db");

const userRoute = require("./routes/userRoute");
app.use(userRoute);

const profileRoute = require("./routes/profileRoute");
app.use(profileRoute);

const addressRoute = require("./routes/addressRoute");
app.use(addressRoute);

const postRoute = require("./routes/postRoute");
app.use(postRoute);

const adminRoute = require("./routes/adminRoute");
app.use(adminRoute);

const superRoute = require("./routes/superRoute");
app.use(superRoute);

const likeRoute = require("./routes/likeRoute");
app.use(likeRoute);

const saveRoute = require("./routes/saveRoute");
app.use(saveRoute);

const commentRoute = require("./routes/commentRoute");
app.use(commentRoute);

const followRoute = require("./routes/followRoute");
app.use(followRoute);

const notificationRoute = require("./routes/notificationRoute");
app.use(notificationRoute);

const reportRoute = require("./routes/reportRoute");
app.use(reportRoute);

const restrictRoute = require("./routes/restrictRoute");
app.use(restrictRoute);

const blockRoute = require("./routes/blockRoute");
app.use(blockRoute);

const chatRoute = require("./routes/chatRoute");
app.use(chatRoute);

const messageRoute = require("./routes/messageRoute");
app.use(messageRoute);

const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 4040;
app.listen(port, ()=> {console.log("Listening on port: "+port+"...")});
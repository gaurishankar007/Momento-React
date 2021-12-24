const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 4040;
app.listen(port, ()=> {console.log("Listening on port: "+port+"...")});
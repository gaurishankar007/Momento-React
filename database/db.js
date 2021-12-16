const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/memonto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
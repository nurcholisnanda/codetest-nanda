const mongoose = require("mongoose");

mongoose.model("userdata", {
    //userName accountNummber emailAddress identityNumber
    userName: {
        type: String,
        require: true,
        unique: true
    },
    accountNummber: {
        type: Number,
        require: true,
        unique: true
    },
    emailAddress: {
        type: String,
        require: true,
        unique: true
    },
    identityNumber: {
        type: Number,
        require: true,
        unique: true
    },
})
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true
    },
    accountNumber: {
        type: Number,
        require: true,
        unique: true
    },
    emailAddress: {
        type: String,
        require: true
    },
    identityNumber: {
        type: Number,
        require: true,
        unique: true
    }
});
const User = mongoose.model("userdata", UserSchema);

module.exports = User;
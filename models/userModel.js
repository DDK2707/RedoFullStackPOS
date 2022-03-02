const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    username: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    cart: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = mongoose.model("Users", userSchema)
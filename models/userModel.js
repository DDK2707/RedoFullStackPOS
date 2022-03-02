const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userid: {
        type: String
    },
    name: {
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
    contact: {
        type: String, 
        required: true
    },
    cart: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = mongoose.model("Users", userSchema)
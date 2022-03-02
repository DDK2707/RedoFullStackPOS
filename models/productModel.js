const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_id: {
        type: String
    },
    producttitle: {
        type: String,
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    image: {
        type: String, 
        required: true,
        default: "placeholder image"
    },
    price: {
        type: Number,
        required: true
    },
    createdby: {
        type: String
    }
});

module.exports = mongoose.model("Products", productSchema)
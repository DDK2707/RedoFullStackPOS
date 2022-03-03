require("dotenv").config();
const express = require("express");
const Product = require("../models/productModel");
const auth = require("../config/auth");
const {getProduct} = require("../config/getSchema");
const app = express.Router();

//get all products
app.get("/", auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//get a single product
app.get("/:id", [auth, getProduct], (req, res, next) => {
    res.send(res.product);
});

//create a product
app.post("/", auth, async (req, res, next) => {
    const {producttitle, category, image, price} = req.body;
    let product;
    image
        ?(product = new products({
            producttitle, 
            category,
            image, 
            createdby: req.user._id,
            price
        }))
        : (product = new products({
            producttitle, 
            category,
            image,
            price,
            createdby: req.user._id
        }));

    try{
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//update a product
app.put("/:id", [auth, getProduct], async (req, res, next) => {
    res.status(400).json({ message: "You do not have permission to update this product"});
    const {producttitle, category, image, price} = req.body;
    if (producttitle) res.product.producttitle = producttitle;
    if (category) res.product.category = category;
    if (price) res.product.price = price;
    if (image) res.product.image = image;
    try {
        const updatedProduct = await res.product.save();
        res.status(201).send(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete a product 
app.delete("/:id", [auth, getProduct], async (req, res, next) => {
    try {
        await res.product.remove();
        res.status(201).json({ message: "Product successfully deleted"});
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = app;

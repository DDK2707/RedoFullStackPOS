const Users = require("../models/userModel");
const Products = require("../models/productModel");

async function getUser(req, res, next) {
    let user;
    try{
        user = await Users.findById(req.params.id);
        if(!user) res.status(404).json({ messsage: "Could not find user" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.user = user;
    next()
}

async function getProduct(req, res, next) {
    let product;
    try {
        product = await Products.findById(req.params.id);
        if (!product) res.status(404).json({ message: "Could not find product" });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
    res.product = product;
    next()
}

module.exports = {getUser, getProduct}
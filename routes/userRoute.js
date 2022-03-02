require("dotenv").config();
const express = require("express");
const Users = require("../models/userModel");
const auth = require("../config/auth")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    getUser, 
    getProduct
} = require ("../config/getSchema");
const app = express.Router();

//get all users
app.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json({ message: "Successfully found all users", results: users});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//get a single user
app.get("/:id", getUser, (req, res, next) => {
    res.send(res,user);
});

//user login with email and password
app.patch("/", async(req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await Users.findOne({ email });
    
    if (!user) res.status(404).json({message: "Could not find user"});
    if (await bcrypt.compare(password, user.password)) {
        try {
            const access_token = jwt.sign(
                JSON.stringify(user),
                process.env.ACCESS_TOKEN_SECRET
            );
            res.status(201).json({
                jwt: access_token
            });
        }catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    } else {
        res.status(400).json({ message: "Recheck login details. Email and password do not match"});
    }
});

//user registration
app.post("/", async (req, res, next) => {
    const{
        username,
        email,
        password, 
        contact
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Users({
        username,
        email, 
        password: hashedPassword,
        contact
    });

    try{
        const newUser = await user.save();

        try{
            const access_token = jwt.sign(
                JSON.stringify(newUser),
                process.env.ACCESS_TOKEN_SECRET
            );
            res.status(201).json({ jwt: access_token })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update user information
app.put("/:id", getUser, async (req, res, next) => {
    const {
        username,
        email,
        password,
        contact
    } = req.body;
    if (username) res.user.username = username;
    if (email) res.user.email = email;
    if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        res.user.password = hashedPassword;
    };
    if (contact) res.user.contact = contact;

    try {
        const updatedUser = await res.user.save();
        res.status(201).send(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

//delete user
app.delete("/:id", getUser, async (req, res, next) => {
    try {
        await res.user.remove();
        res.json({ message: "Deleted user"});
    } catch (error) {
        res.status(500).json({ message: error,message });
    }
});

//CART
//get all products in cart
app.get('/:id/cart', auth, async (req, res, next) => {
    try {
        res.send(req.user.cart)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//add product to cart
app.post('/:id/cart', [auth, getProduct], async (req, res, next) => {
    const user = await Users.findById(req.user._id)
    console.log(user)
    let product_id = res.product._id
    let producttitle = res.product.title
    let category = res.product.category
    let price = res.product.price
    let image = res.product.image
    let qty = req.body.qty
    let createdby = req.user._id
    
    console.log({
        product_id,
        producttitle,
        category,
        image,
        price, 
        qty,
        createdby
    })
    try{
        console.log(Array.isArray(req.user.cart))
        user.cart.push({
            product_id,
            producttitle,
            category,
            image,
            price,
            qty,
            createdby
        })
        const updatedUser = await user.save();
        res.status(201).json(updatedUser)
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//update user cart
app.put("/:id/cart", [auth, getProduct], async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const inCart = user.cart.some((prod) => prod.product_id == req.params.id);
    console.log(inCart)

    if (inCart) {
        try {
            const product = user.cart.find((prod) => prod.product_id == req.params.id)
            product.qty = req.body.qty;
            user.cart.qty = product.qty;
            user.markModified("cart")
            const updatedUser = await user.save();
            console.log(updatedUser)
            res.status(201).json(updatedUser.cart);
        } catch (error) {
            res.status(500).json(console.log(error));
        }
    }
});

//clear cart
app.delete('/:id/cart', [auth, getUser], (req, res, next) => {
    res.send(Users);
})

module.exports = app
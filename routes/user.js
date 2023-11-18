const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require("passport");
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

// First Home GET route
router.get("/" , (req,res) => {
    res.render("first/firstHome");
});

// Login Page GET route
router.get("/login" , forwardAuthenticated ,(req,res) => {
    res.render("first/login");
});

// Signup page GET route
router.get("/signup" , forwardAuthenticated ,(req,res) => {
    res.render("first/signup");
});


router.post("/login" ,(req,res,next) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
    })(req,res,next);
});

router.post("/signup" , async (req,res) => {
    try{
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(req.body.password , salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
        });

        await newUser.save();

        res.redirect("/home");

    } catch{
        // console.log(err);
        res.redirect('/signup');
    }
});

// Logout GET route
router.get("/logout",(req,res) => {
    try{
        req.logOut();
        res.redirect("/");
    }catch{
        res.send("logout auth is failed");
    }
});

module.exports = router;
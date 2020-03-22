const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// Root route
router.get("/", (req, res) => {
    res.render("landing");
});

// Show register form
router.get("/register", (req, res) => {
    res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        }); 
    });
});

// Show login form
router.get("/login", (req, res) => {
    res.render("login", {page: 'login'});
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {});

// Logout route
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
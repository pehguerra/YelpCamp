const express = require("express"),
    router = express.Router(),
    Campground = require('../models/campground'),
    middlware = require('../middleware');


// INDEX - show all campgrounds
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

// CREATE - add new campground to DB
router.post("/", middlware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {name: name, price: price, image: image, description: description, author: author};
    
    // Create a new campground and save to DB
    Campground.create(newCampGround, (err, newlyCrated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create a new campground
router.get("/new", middlware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campgroud
router.get("/:id", (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT - Edit campground route
router.get("/:id/edit", middlware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE - Campground route
router.put("/:id", middlware.checkCampgroundOwnership, (req, res) => {
    // Find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - Campground route
router.delete("/:id", middlware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
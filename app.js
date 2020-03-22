const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      flash         = require('connect-flash'),
      passport      = require('passport'),
      localStrategy = require('passport-local'),
      mtdOverride   = require('method-override'),
      Campground    = require('./models/campground'),
      Comment       = require('./models/comment'),
      User          = require('./models/user'),
      seedDB        = require("./seeds");

// Requiring Routes
const campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes      = require('./routes/comments'),
    indexRoutes        = require('./routes/index');

// ========================================================
// DATABASE CONNECTION
// ========================================================

const url = 'REPLACE HERE BY YOUR MONGODB STRING CONNECTION';
const options = {poolSize: 5, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};

// Config Moongose
mongoose.connect(url, options);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('error', (err) => {
    console.log('Database connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Application disconnected from Database');
});

mongoose.connection.on('connected', () => {
    console.log('Application connected to Database');
});

// Populate database tables
// seedDB();

// Config Express
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(mtdOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Get logged user
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Route files
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, () => {
    console.log("The YelpCamp Server Has Started!");
});
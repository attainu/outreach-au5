var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Event  = require("./models/event"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    // seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    userRoute = require("./routes/user");;
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    eventRoutes = require("./routes/events.js"),
    indexRoutes      = require("./routes/index")
    
mongoose.createConnection("mongodb://localhost/outreach");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(express.static('public'))

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "5855adwqqd8q88q88qqe",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/event", eventRoutes);
app.use("/events/:id/comments", commentRoutes);


app.get("/homepage_n",function(req,res){
    res.sendFile(path.join(__dirname+"/homepage_guest.html"));
})


app.listen(3000, function(){
   console.log("The Server Has Started!");
});

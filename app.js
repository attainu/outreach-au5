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
    hbs = require('hbs'),
    multiparty = require("multiparty"),
    cloudinary = require("cloudinary").v2,
    cities = require('indian-cities-json');


cloudinary.config({
    cloud_name: "outreach",
    api_key: "253755251155147",
    api_secret: "ajOiaFeGGSFeqivX07GixrhcJJ4"
});

    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    eventRoutes = require("./routes/events.js"),
    indexRoutes      = require("./routes/index")
    taskRoutes = require("./routes/tasks")
    userRoutes = require("./routes/users")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://outreach-admin:12211221@outreach-gdicx.mongodb.net/outreach?retryWrites=true&w=majority", { useNewUrlParser: true }).then(()=>console.log("Database Connected ...")).catch(err=>console.log(err));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(express.static('public'));

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
app.use("/task", taskRoutes);
app.use("/tasks/:id/comments", commentRoutes);
app.use("/user", userRoutes);

app.get("/forgotpassword", (req, res) => {
    res.render('forgotpassword')
})

app.listen(process.env.PORT || 3000);

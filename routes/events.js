var express = require("express");
var router  = express.Router();
var Event = require("../models/event");
var middleware = require("../middleware");
var request = require("request");

//INDEX - show all events
router.get("/", function(req, res){
    // Get all events from DB
    Event.find({}, function(err, allEvents){
       if(err){
           console.log(err);
       } else {
           request('https://maps.googleapis.com/maps/api/geocode/json?address=sardine%20lake%20ca&key=AIzaSyBtHyZ049G_pjzIXDKsJJB5zMohfN67llM', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.render("events/index",{events:allEvents});

            }
});
       }
    });
});

//CREATE - add new event to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to events array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newevent = {name: name, image: image, description: desc, author:author}
    // Create a new event and save to DB
    Event.create(newEvent, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/events");
        }
    });
});

//NEW - show form to create new event
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("events/new"); 
});

// SHOW - shows more info about one event
router.get("/:id", function(req, res){
    //find the event with provided ID
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        } else {
            //render show template with event
            res.render("events/show", {event: foundEvent});
        }
    });
});

router.get("/:id/edit", middleware.checkUserevent, function(req, res){
    //find the event with provided ID
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        } else {
            //render show template with that event
            res.render("events/edit", {event: foundEvent});
        }
    });
});

router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Event.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, event){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/events/" + event._id);
        }
    });
});


module.exports = router;

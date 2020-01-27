var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var request = require("request");
var cities = require('indian-cities-json'),
    multiparty = require("multiparty"),
    cloudinary = require("cloudinary").v2;
    
//INDEX - show a logged in user page
router.get("/", function (req, res) {
    // Get all events from DB
    var cityName = []
    cityName.push(cities)
    var names = []
    for(i=0; i<1221; i++){
        var x = cityName[0].cities[i].name
        names.push(x)
    }
    
    User.findById(req.user.id, function (err, details) {
        if (!err) {
            res.render("user_profile", {
                details: details,
                data:names
            });
        }
    });
});


router.put("/updateprofile/:id", function (req, res) {
    var newData = {
        name: req.body.name,
        about: req.body.about,
        gender: req.body.gender,
        phone: req.body.phone,
        city: req.body.city
    };
    User.findByIdAndUpdate(req.user.id, {
        $set: newData
    }, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/user");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/user");
        }
    });
});

//Upadate Password
router.put("/changePassword/:id",(req,res)=>{
    User.findOne({_id:req.user.id},(err,user)=>{
        user.setPassword(req.body.newpassword,(errr,result)=>{
            user.save((error)=>{
            });            
            res.redirect("/logout")
        })
    })
});


router.delete('/:id', middleware.checkUserEvent, function (req, res) {
    Event.findByIdAndRemove(req.params.id, function (err, updatedEvent) {
        if (!err) {
            res.redirect("/")
        }
    })
})

//Upload Profile Photo
router.put("/changeprofilephoto", middleware.isLoggedIn, function (req, res) {
    var ff = new multiparty.Form();
    ff.parse(req, (err, fields, file) => {
        cloudinary.uploader.upload(file.imageFile[0].path, (err, result) => {
            var imageFile = result.secure_url;
            // Create a new event and save to DB
            User.findByIdAndUpdate(req.user.id, { imageFile : imageFile} , (err, user) => {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("/");
                } else {
                    user.save()
                    req.flash("success", "Successfully Updated!");
                    res.redirect("/");
                }
            })
        });
    });



});
module.exports = router;
var express = require("express");
var router = express.Router();
var Task = require("../models/task");
var middleware = require("../middleware");
var request = require("request");
var User = require("../models/user"),
    cloudinary = require("cloudinary").v2,
    multiparty = require("multiparty");
//INDEX - show all tasks
router.get("/", function (req, res) {
    // Get all events from DB
    Task.find({}, function (err, allTasks) {
        if (!err) {
            res.render("tasks/index", {
                tasks: allTasks
            });
        }
    });
});

//CREATE - add new event to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    var ff = new multiparty.Form();
    ff.parse(req, (err, fields, file) => {

        cloudinary.uploader.upload(file.imageFile[0].path, (err, result) => {
            var taskname = fields.taskname[0];
            var city = fields.city[0];
            var imageFile = result.secure_url;
            var desc = fields.description[0];
            var shortdesc = fields.description[0].substring(0, 100);
            var author = req.user.id
            var newTask = {
                name: taskname,
                image: imageFile,
                city: city,
                description: desc,
                shortdescription: shortdesc,
                author: author
            }
            // Create a new event and save to DB
            Task.create(newTask, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/");
                }
            });
        });
    });
});

//NEW - show form to create new event
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("tasks/new");
});

// SHOW - shows more info about one event
router.get("/:id", middleware.isLoggedIn, function (req, res) {
    //find the event with provided ID
    var isAdmin = false
    console.log(req.params.id)
    Task.findById(req.params.id).populate("comments").exec(function (err, foundTask) {
        if (err) {
            console.log(err);
        } else {
            if (JSON.stringify(foundTask.author) === JSON.stringify(req.user._id))
                isAdmin = true;
            // {var i = foundTask.comments[0]._doc.author}

            var i = foundTask.comments
            var x = foundTask.comments, len = x.length
            var fetchedDetails = []
            var text = "";
            if (len) {
                recurse(0)
            }
            else {
                res.render("tasks/show", {
                    task: foundTask,
                    state: isAdmin,
                    i: fetchedDetails
                });
            }

            function recurse(z) {
                if (z < len) {
                    User.findById(x[z]._doc.author, (err, result) => {
                        var commentDetails = {
                            text: x[z].text,
                            name: result._doc.name,
                            imageFile: result._doc.imageFile
                        }
                        fetchedDetails.push(commentDetails)
                        recurse(z + 1)
                    })
                } else if (z == len) {
                    res.render("events/show", {
                        event: foundTask,
                        state: isAdmin,
                        i: fetchedDetails
                    });
                }
            }

        }
    });
});


router.put("/:id", middleware.checkUserTask, function (req, res) {
    var newData = {
        name: req.body.taskname,
        image: req.body.imageFile,
        description: req.body.description,
        city: req.body.city
    };
    Task.findByIdAndUpdate(req.params.id, {
        $set: newData
    }, function (err, task) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/task/" + task._id);
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/task/" + task._id);
        }
    });
});

router.delete('/:id', middleware.checkUserTask, function (req, res) {
    Task.findByIdAndRemove(req.params.id, function (err, updatedTask) {
        if (!err) {
            res.redirect("/")
        }
    })
})

module.exports = router;
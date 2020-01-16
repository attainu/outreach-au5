var express = require("express");
var router  = express.Router({mergeParams: true});
var Event = require("../models/event");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find event by id
    console.log(req.params.id);
    event.findById(req.params.id, function(err, event){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {event: event});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup event using ID
   Event.findById(req.params.id, function(err, event){
       if(err){
           console.log(err);
           res.redirect("/events");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               event.comments.push(comment);
               event.save();
               console.log(comment);
               req.flash('success', 'Your comment has been posted!');
               res.redirect('/events/' + event._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {event_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/events/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/events/" + req.params.id);
        }
    })
});

module.exports = router;

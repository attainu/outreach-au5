var express = require("express");
var router  = express.Router({mergeParams: true});
var Event = require("../models/event");
var Task = require("../models/task");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//Comments Create for Event
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
               comment.author = req.user.id
               //save comment
               comment.save();
               event.comments = event.comments.concat([comment])
               event.save((err) =>{
                   console.log('Error' + err)
               });
               req.flash('success', 'Your comment has been posted!');
               res.redirect('/event/' + event._id);
           }
        });
       }
   });
});

//Comments create for Task
router.post("/tasks",middleware.isLoggedIn,function(req, res){
    //lookup event using ID
    Task.findById(req.params.id, function(err, task){
        if(err){
            console.log(err);
            res.redirect("/tasks");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                comment.author= req.user._id;
                comment.save();
                task.comments = task.comments.concat([comment])
                task.save((err) =>{
                    console.log('Error' + err)
                });
                req.flash('success', 'Your comment has been posted!');
                res.redirect('/task/' + task._id);
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

router.put("/:commentId",middleware.checkUserComment, function(req, res){
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
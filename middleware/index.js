var Comment = require("../models/comment");
var Event = require("../models/event");
var Task = require("../models/task");
var flash = require("connect-flash")
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/homepage_guest");
    },
    isNotLoggedIn: function(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/");
    },
    checkUserEvent: function(req, res, next){
        if(req.isAuthenticated()){
            Event.findById(req.params.id, function(err, event){
               if(JSON.stringify(event.author) === JSON.stringify(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You donot have the required permission");
                   console.log(req.flash("error"))
                   res.redirect("/event/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Please sign in first!");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(JSON.stringify(comment.author) === JSON.stringify(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You donot have the required permission");
                   res.redirect("/events/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Please sign in first!");
            res.redirect("login");
        }
    },
    checkUserTask: function(req, res, next){
        if(req.isAuthenticated()){
            Task.findById(req.params.id, function(err, task){
               if(JSON.stringify(task.author) === JSON.stringify(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You donot have the required permission");
                   console.log(req.flash("error"))
                   res.redirect("/task/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Please sign in first!");
            res.redirect("/login");
        }
    }
}
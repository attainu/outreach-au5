var Comment = require("../models/comment");
var Event = require("../models/event");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserEvent: function(req, res, next){
        if(req.isAuthenticated()){
            Event.findById(req.params.id, function(err, event){
               if(event.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You donot have the required permission");
                   res.redirect("/events/" + req.params.id);
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
               if(comment.author.id.equals(req.user._id)){
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
    }
}

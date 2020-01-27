  
var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
   name: String,
   image: String,
   city: String,
   description: String,
   shortdescription: String,
   author: String,
   likes_count: {type:Number,default:0},
   likes : 
      {
         type:mongoose.Schema.Types.Mixed,
         default:{}
      },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Task", TaskSchema);
  
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    name: String,
    city: String,
    username: String,
    gender: String,
    token: String,
    about: {type:String,default:"Please edit your about..."},
    phone: {type:String,default:"NA"},
    imageFile: {type:String,default:"https://res.cloudinary.com/de189qjwo/image/upload/v1579693244/user_1_xpcx6a.png"}
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
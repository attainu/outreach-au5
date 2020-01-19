const express = require("express"),
      bodyParser = require("body-parser"),
      router = express.Router(),
      MongoClient = require('mongodb').MongoClient,
      ObjectID = require('mongodb').ObjectID,
      path = require("path"),
      bcrypt = require("bcrypt");
      
router.use(bodyParser.json());

var collection;
const url = "mongodb+srv://outreach-admin:123123123@outreach-gdicx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }else{
       console.log('Database Connected...');
       collection = client.db("test").collection("devices");
   }
});

router.post("/", function(req,res){
    collection.findOne({email:req.body.email})
    .then((result)=>{
        if(!result){
            var bo = req.body;
            bcrypt.hash(bo.password,10,(err,hash)=>{
                if(err)
                    console.log("bcrypt err:",err);
                else{
                    var newUser = {
                    _id: new ObjectID(),
                    firstName : bo.firstname,
                    lastName : bo.lastname,
                    email : bo.email,
                    city : bo.city,
                    dob : bo.dob,
                    gender : bo.gender,
                    password : hash};
            
                    console.log(newUser);
                    collection.insertOne(newUser, (err, result)=>{
                    if(err)
                        console.log(err);
                    else
                        console.log("User created successfully!");
                    });
                }
            });
        }else
            console.log("Email id already exists!");
    });
    res.send();
});

router.post("/update",(req,res)=>{
    var bo = req.body;
    var type = bo.type;
    
    switch (type) {
        case "name":
            collection.updateMany({_id:ObjectID("5e04a883370c531404af2604")},{$set:{firstName:bo.firstname, lastName:bo.lastname}});
            break;
        case "city":
            collection.updateOne({_id:ObjectID("5e04a883370c531404af2604")},{$set:{city:bo.city}});
            break;
        case "dob":
            collection.update({_id:ObjectID("5e04a883370c531404af2604")},{$set:{dob:bo.dob}});
            break;
        case "gender":
            collection.updateOne({_id:ObjectID("5e04a883370c531404af2604")},{$set:{gender:bo.gender}});
            break;
        case "password":
            bcrypt.hash(bo.password,10,(err,hash)=>{
                if(err)
                    console.log("bcrypt err:",err);
                else
                    collection.updateOne({_id:ObjectID("5e04a883370c531404af2604")},{$set:{password:hash}})
            });
            break;
    }
    res.send();
});

router.get("/11", function(req,res){
    collection.find({}).toArray(function(err, users){
        if(err)
            console.log(err);
        else    
            res.send(users);
    });
});

function closeDB(){
    client.close();
}

process.on('exit', closeDB);
process.on('SIGINT', closeDB);
process.on('SIGTERM', closeDB);
process.on('SIGKILL', closeDB);
process.on('uncaughtException', closeDB);

module.exports = router;
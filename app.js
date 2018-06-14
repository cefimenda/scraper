
var express = require("express");
var app = express();


//middleware that allows us to pass the data coming from POST Request and also convert it into JSON
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//connect mongoose database to app --> run mongod and mongo on separate terminal shells. to quit mongo type quit()
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI ||"mongodb://localhost:27017/node-demo", function(){
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
      });
}); //Mongo runs on port 27017 by default

//create a schema to store the data in the right way
var nameSchema = new mongoose.Schema({
    companyName: String,
    businessModelSelection: String,
    businessModelDescription: String,
    companyWebsite: String,
    companyLinkedin: String,
    businessDescription: String,
},{strict: false});

//line to create model from our Schema
var info = mongoose.model("info", nameSchema);

app.post("/newProjection",(req,res) => {
    var myData = new info(req.body);
    myData.save()
    .then(item =>{  //then runs if data save was successful
        res.sendFile(__dirname + "/confirmed.html")
        
    })
    .catch(err =>{  //.catch runs if data save was unsuccessful
        res.status(400).send("unable to save to database");
    })
});

app.use(express.static('home'))


// app.get("/",(req,res)=> {
//     //we used .sendFile to use a separate html file in the localport. __dirname gets current working directory that the app.js is running from
//     res.sendFile(__dirname + "/home/");

// });



var express = require("express");
var app = express();
var port = process.env.PORT || 8080;

var playbill = require("./playbill.js")
var backstage = require("./backstage.js")

app.get("/",(req,res)=> {
    backstage.scrape().then((value) => {
        res.send(JSON.stringify(value));
        res.end();
    })
}); 
app.listen(port, () => console.log('Example app listening on port' + port))
// app.listen("/scrape",() => console.log('Listening for scrape request'))

var express = require("express");
var app = express();
var puppeteer = require('puppeteer');

var port = process.env.PORT || 8080;


// var playbill = require("./playbill.js")
// var backstage = require("./backstage.js")

app.use(express.static('home'))

var auditions = require( './node_auditions' );
var scrapePlaybill = require('./node_scrapePlaybill')
var scrapeBackstage = require('./node_scrapeBackstage')



app.get("/playbill",(req,res)=> {
    console.log("received playbill request")
    console.log('gettingPlaybill is'+String(auditions.gettingPlaybill))
    if (auditions.gettingPlaybill === false){
        scrapePlaybill.scrape()
        result={
            value : auditions.playbillProgress
        }
        console.log(result)
        res.send(JSON.stringify(result));
        res.end();
    }
    else{
        if(auditions.playbillProgress === 100){
            console.log('sending auditions')
            console.log(auditions.playbill)
            res.send(JSON.stringify(auditions.playbill));
            auditions.gettingPlaybill=false
            auditions.playbillProgress=0;
        }else{
            console.log('sending result object')
            result={
                value : auditions.playbillProgress
            }
            console.log(result)
            res.send(JSON.stringify(result))
        }
        console.log('ending this request')
        console.log("____________________")
        res.end();
    }
}); 
app.get("/backstage",(req,res)=> {
    console.log("received backstage request")
    console.log('gettingBackstage is'+String(auditions.gettingBackstage))
    if (auditions.gettingBackstage === false){
        scrapeBackstage.scrape()
        result={
            value : auditions.backstageProgress
        }
        console.log(result)
        res.send(JSON.stringify(result));
        res.end();
    }
    else{
        if(auditions.backstageProgress === 100){
            console.log('sending auditions')
            console.log(auditions.backstage)
            res.send(JSON.stringify(auditions.backstage));
            auditions.gettingBackstage=false
            auditions.backstageProgress=0;
        }else{
            console.log('sending result object')
            result={
                value : auditions.backstageProgress
            }
            console.log(result)
            res.send(JSON.stringify(result))
        }
        console.log('ending this request')
        console.log("____________________")
        res.end();
    }
}); 
app.listen(port, () => console.log('Example app listening on port' + port))

// app.listen("/scrape",() => console.log('Listening for scrape request'))




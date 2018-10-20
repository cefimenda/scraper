const db = require("../models");
const auditions = require('../node_auditions');
const scrapePlaybill = require('../node_scrapePlaybill')
const scrapeBackstage = require('../node_scrapeBackstage')
const mongo = require("../mongo");

module.exports = function (app) {

    app.get("/api/playbill", (req, res) => {
        console.log('gettingPlaybill is' + String(auditions.gettingPlaybill))
        if (auditions.gettingPlaybill === false) {
            scrapePlaybill.scrape()
            result = {
                value: auditions.playbillProgress
            }
            res.send(JSON.stringify(result));
            res.end();
        }
        else {
            if (auditions.playbillProgress === 100) {
                console.log('sending auditions')
                res.send(JSON.stringify(auditions.playbill));
                auditions.gettingPlaybill = false
                auditions.playbillProgress = 0;
            } else {
                console.log('sending result object')
                result = {
                    value: auditions.playbillProgress
                }
                res.send(JSON.stringify(result))
            }
            console.log('ending this request')
            console.log("____________________")
            res.end();
        }
    });
    app.get("/api/backstage", (req, res) => {
        console.log('gettingBackstage is' + String(auditions.gettingBackstage))
        if (auditions.gettingBackstage === false) {
            scrapeBackstage.scrape()
            result = {
                value: auditions.backstageProgress
            }
            res.send(JSON.stringify(result));
            res.end();
        }
        else {
            if (auditions.backstageProgress === 100) {
                console.log('sending auditions')
                res.send(JSON.stringify(auditions.backstage));
                auditions.gettingBackstage = false
                auditions.backstageProgress = 0;
            } else {
                console.log('sending result object')
                result = {
                    value: auditions.backstageProgress
                }
                res.send(JSON.stringify(result))
            }
            console.log('ending this request')
            console.log("____________________")
            res.end();
        }
    });
    app.post("/api/newComment", (req, res) => {
        //code that adds the incoming data into a mongo db
        mongo.Comment.create(req.body).then(function (response) {
            res.send(response)
        })
    })
    app.get("/api/comments/:id", (req, res) => {
        var id = String(req.params.id);
        mongo.Comment.find({auditionId:id}).then(function (comments) {
            res.json(comments)
        });
    });
};

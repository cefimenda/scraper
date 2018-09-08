var auditions = require('./node_auditions');
const mysql = require("mysql");
const cTable = require('console.table');

function Table(name) {
    this.name = name;
    this.config = {
        host: "lyl3nln24eqcxxot.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "nq0ujrheah7k8l3m",
        password: "n49p5kdrk42r59lg",
        database: "kl31oyerw434a2bj"
    };
    this.connect = function () {
        this.connection = mysql.createConnection(this.config)
    };
    this.print = function (input) {
        return new Promise((resolve, reject) => {
            var query = "SELECT ?? FROM ?? LIMIT ?";
            var filter = input || "*"
            this.connection.query(query, [filter, this.name, 100], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.table(res)
                resolve()
            });
        })
    };
    this.getItem = function (column, target, amount, comparison) {
        return new Promise((resolve, reject) => {
            var compare = comparison || "="
            var escaper = [this.name, column, target]
            if (compare === "=") {
                var query = "SELECT * FROM ?? WHERE ?? = ? ORDER BY id DESC";
            } else if (compare === "<") {
                var query = "SELECT * FROM ?? WHERE ?? < ? ORDER BY id DESC";
            }
            if (amount){
                query+=" LIMIT ?"
                escaper.push(amount)
            }
            this.connection.query(query, escaper, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            });
        })
    };
    this.changeTable = function (propToChange, newValueforProp, columnToTarget, targetCriteria) {
        return new Promise((resolve, reject) => {
            var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?;"
            this.connection.query(query, [this.name, propToChange, newValueforProp, columnToTarget, targetCriteria], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully updated the table " + this.name + " for " + propToChange + " to have a value of " + newValueforProp + " where " + columnToTarget + " is equal to " + targetCriteria + ".")
            });
        })
    };
    this.newItem = function (audition) {
        return new Promise((resolve, reject) => {
            if (this.name === "auditions") {
                var query = "INSERT INTO auditions (title,source,category,tags,isUnion,compensation,link,organization,state,date) values (?,?,?,?,?,?,?,?,?,?);";
                var escaper = [audition.title, audition.source, audition.category, audition.tags, audition.isUnion, audition.compensation, audition.link, audition.organization, audition.state, audition.date]
                this.connection.query(query, escaper, function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("audition successfully added")
                })
            }
        })
    };
    this.newGroup = function (auditionList) {
        return new Promise((resolve, reject) => {
            if (auditionList.length === 0) {
                resolve("No new auditions to add")
                return
            }
            var query = "INSERT INTO auditions (title, source, category, tags, isUnion, compensation, link, organization, state, date) values ?; ";
            var escaper = [];
            for (var i = auditionList.length - 1; i > -1; i--) {
                var audition = auditionList[i]
                escaper.push([audition.title, audition.source, audition.category, audition.tags, audition.isUnion, audition.compensation, audition.link, audition.organization, audition.state, audition.date])
            }
            this.connection.query(query, [escaper], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(auditionList.length + " auditions successfully added")
            })
        })
    };
    this.deleteItem = function (column, target, condition) {
        return new Promise((resolve, reject) => {
            if (!condition || condition === "=") {
                var query = "DELETE FROM ?? WHERE ?? = ?";
            } else if (condition === ">") {
                var query = "DELETE FROM ?? WHERE ?? > ?";
            }
            this.connection.query(query, [this.name, column, target], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully deleted item(s) with a " + column + " of " + target + ".")
            })
        })
    }
    this.getMostRecent = function (amount, source) {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM ?? WHERE source = ? ORDER BY id DESC LIMIT ?;"
            this.connection.query(query, [this.name, source, amount], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }
}


module.exports = Table





// EXAMPLE SEQUENCE TO TEST OUT OUR TABLE CONSTRUCTOR
// var auditionsDB = new Table("auditions")
// auditionsDB.connect()
// // auditions.print()
// auditionsDB.getMostRecent(1).then(function (result) {
//     console.log(result)
//     auditionsDB.connection.end()
// })



// var testAudition = { title: "Rakel'in auditioni", compensation: "Paid", state: "NY", organization: "Intellion Inc." }
// auditionDB.insertAudition(testAudition)
// auditionDB.connection.end()

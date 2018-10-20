const express = require("express");
const app = express();
const db = require("./models");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

var PORT = process.env.PORT || 8080;

app.use(express.static('home'))

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var uristring = process.env.MONGODB_URI || 'mongodb://localhost/scavenger';
mongoose.connect(uristring, { useNewUrlParser: true });


// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
    // syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
    app.listen(PORT, function () {
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        );
    });
});

module.exports = app;
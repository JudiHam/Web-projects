const PORT = process.env.PORT || 5000;

var express = require("express");
var app = express();
var fs = require("fs");

app.set("view engine", "ejs");

//Read json file into variable
var file = fs.readFileSync("./favs.json");

//When receiving data from a web server, the data is a string.
//Parse the data with JSON.parse(), and the data becomes a JS object.
var jsondata = JSON.parse(file);

console.log(jsondata);

app.get("/", function(req, res) {
    res.render("pages/index", jsondata);
});

app.listen(PORT, function() {
    console.log("App listening on port 5000!");
});


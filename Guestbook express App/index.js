const PORT = process.env.PORT || 5000;

var fs = require("fs");

// Bring express
var express = require("express");

var app = express();

//Bring body-parser (helps handle form data we get with the POST request)
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To serve static content from project directory
app.use(express.static("./sivut"));

//Read json file into variable
var file = fs.readFileSync("sivut/messages.json");

//When receiving data from a web server, the data is a string.
//Parse the data with JSON.parse(), and the data becomes a JS object.
var jsondata = JSON.parse(file);

//Create routes

//1. Frontpage
app.get("/", function(req, res) {
    res.sendFile(__dirname + "\\index.html");
});

//2. New message form
app.get("/newmessage", function(req, res) {
    res.sendFile(__dirname + "\\newmessage.html");
});

//3. Next is a route called "sendform" that was declared in the newmessage.html form 
//and reacts to the POST-type request from the form when the send-button is pushed.
app.post("/sendform", function(req, res) {
    //Save response elements as variables 
    console.log(req.body);
    var username = req.body.username;
    var country = req.body.country;
    var message = req.body.message;
    var date = new Date();
    var d = date.toDateString();
    console.log(username + country + message + d);
    //Create a new JS message object 
    var newmsg = {
        username: username,
        country: country,
        message: message,
        date: d,
    };
    console.log("newmsg:" + newmsg);
    //Push the object to the parsed json file
    jsondata.push(newmsg);
    //When sending data back to the server, the data has to be a string.
    //Convert the jsondata JS object into a string with JSON.stringify() and add parameters to format it.
    var data = JSON.stringify(jsondata, "", 1);
    //Add new data to json file
    fs.writeFileSync("sivut/messages.json", data);
    res.redirect("newmessage.html");
});

//3. Guestbook messages page
app.get("/guestbook", function(req, res) {
    var taulukko = "";
    for(var i=0; i<jsondata.length; i++) {
        taulukko += 
        '<tr>' + 
        '<td>' + jsondata[i].username + '</td>' +
        '<td>' + jsondata[i].country + '</td>' +
        '<td>' + jsondata[i].message + '</td>' +
        '<td>' + jsondata[i].date + '</td>'
        '</tr>';
    }
    var html = 
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8"/> 
            <title>Guestbook</title>  
            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/pure-min.css" integrity="sha384-LTIDeidl25h2dPxrB2Ekgc9c7sEC3CWGM6HeFmuDNUjX76Ert4Z4IY714dhZHPLd" crossorigin="anonymous">
            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/pure-min.css" integrity="sha384-LTIDeidl25h2dPxrB2Ekgc9c7sEC3CWGM6HeFmuDNUjX76Ert4Z4IY714dhZHPLd" crossorigin="anonymous">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Bad+Script&display=swap" rel="stylesheet"> 
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200&display=swap" rel="stylesheet"> 
         <style>
            .content {
            margin: auto;
            width: 30%;
                    } 
      h1 {
          font-family: 'Bad Script', cursive;
          margin: 35px 0;
      }
      form {
        margin: 20px 0;
      }
      table {
          margin: 20px auto;
      }
      .pure-button {
          background-color: #befff8c2;
          margin: 2px auto;
          font-family: 'Bad Script', cursive;
      }
      th {
          background-color: #bbbbbbdb;
          color: white;
          font-family: 'Bad Script', cursive;
      }
      #btn1 {
        margin-top: 20px;
      }
      p, label, input, h2, table {
        font-family: 'Nunito Sans', sans-serif;
      }
    </style>
  </head>
        <body>
        <div class="content">
            <h1>Guestbook App</h1>
            <p>Guestbook</p>
            <a class="pure-button" href="index.html">Home</a>
            <a class="pure-button" href="newmessage.html">New message</a>
            <a class="pure-button" href="/guestbook">Guestbook</a>
            <a class="pure-button" href="ajaxmessage.html">Ajax message</a>        
            <table class="pure-table pure-table-bordered"><thead><tr><th>Username</th><th>Country</th><th>Message</th><th>Date</th></tr></thead>
            ${taulukko}
        </div>`;
    res.send(html);
});

//5. Route that reacts to ajaxmessage.html ajax request when the send-button is pushed
app.post("/sendajaxform", function(req, res) { 
    //Save form data that ajax has sent to same json file from before
    console.log(req.body);
    var username = req.body.username;
    var country = req.body.country;
    var message = req.body.message;
    var date = new Date();
    var d = date.toDateString();
    console.log(username + country + message + d);
    var newmsg = {
        username: username,
        country: country,
        message: message,
        date: d,
    };
    console.log("newmsg:" + newmsg);
    //Push the object to the parsed json file
    jsondata.push(newmsg);
    //When sending data back to the server, the data has to be a string.
    //Convert the jsondata JS object into a string with JSON.stringify() and add parameters to format it.
    var data = JSON.stringify(jsondata, "", 1);
    //Add new data to json file
    fs.writeFileSync("sivut/messages.json", data);
    //send json data as response to ajaxmesage.html
    res.send(data);
});

//6. New AJAX message form
app.get("/ajaxmessage", function(req, res) {
    res.sendFile(__dirname + "\\ajaxmessage.html");
});

app.listen(PORT, function() {
    console.log("Example app listening on port 5000!");
});


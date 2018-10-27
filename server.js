//declaring the dependencies that we will use to run the post and get requests
var express = require('express');
var mySQL = require('mysql');
var cors = require('cors');

//this declares that we are using an express object
var app = express();
app.use(cors());

//our port will be determined by heroku, or else it will be set as default to 3000
var port = process.env.PORT || 3000;

//setting up params for a db connection to the sql database
//we are using cleardb to maintain a database connection through our heroku server
var connection = mySQL.createConnection({
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb1f6f893c4a2e',
  password: '12aba883',
  database: 'heroku_6d22e6ede03be83'
});

//declares the actual connection to the database
connection.connect(function(error) {
  if(error) {
    console.log('Error');
  } else {
    console.log('Connection');
  }
});

//this leads to the sign up page from the frontend
//this post will be retrieving data from the user as they input their information
//we will then retreive this information
//we will use this data to query our db
//if the use doesn't exist, then we will insert into the database
app.post('/signup', function(req, res) {
  var email = req.email;
  var first = req.first;
  var last = req.last;
  var password = req.password;
  var admin = 0;
  connection.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)", [email, first, last, password, admin], function(error, results, fields) {
    if(error) {
      console.log("Error inserting data");
    } else {
      console.log("Successful insert");
    }
  });
});

//this leads to the login page on the frontend
//this get request checks the current database.
//if the current user does not exist in the db, then it will return false
//this takes into account if the email is spelled incorrectly
app.get('/login', function(req, res) {
    var email = "Lucy@gmail.com";//req.email;
    var password = "TimBits"; //req.password;
    connection.query("SELECT email, password FROM accounts WHERE email = ? AND password = ?", [email, password], function (error, results, fields) {
      if(error) {
        console.log("Error retreviving user");
      } else if(results.length > 0) {
        res.send(JSON.stringify(results[0].email));
      } else {
        res.send("No such user exists");
      }
    });
});

app.listen(port, function() {
    console.log('Hit it');
});

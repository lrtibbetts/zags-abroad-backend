//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');
var mySQL = require('mysql');
var cors = require('cors');

//Declares that we are using an express object
var app = express();
app.use(cors());

//Port determined by Heroku,else Default as localhost:3000
var port = process.env.PORT || 3000;

//Setting up params for DB connection to the SQL database
//Using ClearDB to maintain database connection through Heroku server
var connection = mySQL.createConnection({
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb1f6f893c4a2e',
  password: '12aba883',
  database: 'heroku_6d22e6ede03be83'
});

//Declares the connection to database
connection.connect(function(error) {
  if(error) {
    console.log('Error');
  } else {
    console.log('Connection');
  }
});

//SIGN UP PAGE
//Recieves data from user inputed information
//Querys db using this data
//If the use does not exist, then insert into the database
app.post('/signup', function(req, res) {
  var email = JSON.stringify(req.email);
  var first = JSON.stringify(req.first);
  var last = JSON.stringify(req.last);
  var password = JSON.stringify(req.password);
  var admin = 0;
  connection.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)", [email, first, last, password, admin], function(error, results, fields) {
    if(error) {
      console.log("Error inserting data");
    } else {
      console.log("Successful insert");
    }
  });
});

//LOGIN PAGE
//Checks the current database
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

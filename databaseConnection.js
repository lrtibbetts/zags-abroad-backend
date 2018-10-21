var express = require('express');
var mySQL = require('mysql');
var app = express();

var connection = mySQL.createConnection({
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb1f6f893c4a2e',
  password: '12aba883',
  database: 'heroku_6d22e6ede03be83'
});

connection.connect(function(error) {
  if(!!error) {
    console.log('Error');
  } else {
    console.log('Connection');
  }
});

app.post('/signup', function(req, resp) {
  var email = req.email;
  var first = req.first_name;
  var last = req.last_name;
  var password = req.password;
  var admin = req.is_admin;
  //var query = "INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES ('cnorman2@zagmail.gonzaga.edu', 'Claire', 'Norman', 'pass1234', 0)"
  //"INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)" , email, first, last, password, admin,
  connection.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)", email, first, last, password, admin, function(error, results, fields) {
    if(error) {
      console.log("Error inserting data");
    } else {
      console.log("Successful insert");
    }
  });
});
app.listen(1337);

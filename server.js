//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');
var mySQL = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');

//Declares that we are using an express object
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//Port determined by Heroku, else default as localhost:3000
var port = process.env.PORT || 3001;

//Setting up params for DB connection to the SQL database
//Using ClearDB to maintain database connection through Heroku server
var pool = mySQL.createPool({
  connectionLimit: 100,
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb1f6f893c4a2e',
  password: '12aba883',
  database: 'heroku_6d22e6ede03be83'
});

//SIGN UP PAGE
//Receives data from user inputted information
//Queries db using this data
//If the user does not exist, then insert into the database
app.post('/signup', function(req, res) {
  var email = req.body.email;
  var first = req.body.first;
  var last = req.body.last;
  var password = req.body.password;
  var admin = 0;
  pool.getConnection(function(error, connection) {
    connection.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)", [email, first, last, password, admin], function(error, result, fields) {
      if(error) {
        console.log("Error inserting data");
        res.send("Error inserting data")
      } else {
        console.log("Successful insert");
        res.send(result)
      }
    });
    connection.release();
  });
});

//LOGIN PAGE
//Checks the current database
//If user does not exist in the db, then return false
//Takes into consideration if email is spelled incorrectly
app.get('/login', function(req, res) {
    var email = "Lucy@gmail.com";//req.email;
    var password = "TimBits"; //req.password;
    // TODO: change to use pool
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
    console.log('Listening on port ' + port);
});

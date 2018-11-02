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
//If email is not already in the database, then insert
//Else, return "User already exists"
app.post('/signup', function(req, res) {
  var email = req.body.email;
  var first = req.body.first;
  var last = req.body.last;
  var password = req.body.password;
  var admin = 0;
  pool.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)",
    [email, first, last, password, admin],
    function(error, result) {
      if(error) {
        res.send("User already exists");
      } else {
        res.send(result);
      }
    });
});

//LOGIN PAGE
//If email does not exist in db, return "Email not found"
//If email exists but password is incorrect, return "Incorrect password"
//If valid login, return account info (json)
app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    pool.query("SELECT * FROM accounts WHERE email = ?", [email], function (error, result) {
        if(error) {
          res.send(error);
        } else if(result.length > 0) {
          // Email found
          if(result[0].password === password) {
            // Correct password
            res.send(result[0]);
          } else {
            res.send("Incorrect password");
          }
        } else {
          res.send("Email not found");
        }
    });
});

//COURSE EQUIVALENCY PAGE
app.get('/courses', function(req, res) {
    pool.query("SELECT host_program, host_course_number, host_course_name, gu_course_number, gu_course_name FROM course_equivalencies",
    function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

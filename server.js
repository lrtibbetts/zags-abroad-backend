//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');
var mySQL = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var bcrypt = require('bcrypt');
const saltRounds = 10;

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
  // https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt
  bcrypt.hash(password, saltRounds, function(hashError, hash) {
    if (hashError) {
      console.log(hashError);
    } else {
      pool.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)",
        [email, first, last, hash, admin],
        function(queryError, queryResult) {
          if(queryError) {
            res.send("User already exists");
          } else {
            res.send(queryResult);
          }
        });
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
    pool.query("SELECT * FROM accounts WHERE email = ?", [email], function (queryError, queryResult) {
        if(queryError) {
          res.send(queryError);
        } else if(queryResult.length > 0) {
          // Email found
          bcrypt.compare(password, queryResult[0].password, function(bcryptError, bcryptResult) {
            if(bcryptResult){
              res.send(queryResult[0]);
            } else {
              res.send("Incorrect password");
            }
          });
        } else {
          res.send("Email not found");
        }
    });
});

//COURSE EQUIVALENCY PAGE
app.get('/courses', function(req, res) {
    pool.query("SELECT host_program, host_course_number, host_course_name, gu_course_number, gu_course_name FROM course_equivalencies",
    function(queryError, queryResult) {
      if(queryError) {
        res.send(queryError);
      } else {
        res.send(queryResult);
      }
    });
});

//ADD A COURSE TO THE EQUIVALENCY TABLE
var host_program = "a" //req.body.host_program;
var host_course_number = "a" //req.body.host_course_number;
var host_course_name = "a" //req.body.host_course_name;
var gu_course_number = "a" //req.body.gu_course_number;
var gu_course_name = "a" //req.body.gu_course_name;
var comments = "a" //req.body.comments;
var signature_needed = "a" //req.body.signature_needed;
var department = "a" //req.body.department;
var approved_by = "a" //req.body.approved_by;
var approval_date = "a" //req.body.approval_date;
var approved_until = "a" //req.body.approved_until;

//this will need to be changed because it will be connected to a button
//use /courses
app.post('/courses/addcourses', function(req, res) {
  pool.query("INSERT INTO course_equivalencies (host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, comments, signature_needed," +
  " department, approved_by, approval_date, approved_until) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
  [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, comments, signature_needed, department, approved_by, approval_date, approved_until],
  function(addError, addResult) {
    if(addError) {
      console.log("NO insert made");
      res.send("There is an error adding the course");
    } else {
      console.log("inserted course");
      res.send(addResult);
    }
  })
})
//DELETE A COURSE FROM THE EQUIVALENCY TABLE
//use /courses to delete the course
//this will be linked to a button
//also to test locally, change to a get request
app.post('/courses/deletecourse', function(req, res) {
  var host_program = "a" //req.body.host_program;
  var host_course_number = "a" //req.body.host_course_number;
  var host_course_name = "a" //req.body.host_course_name;
  var gu_course_number = "a" //req.body.gu_course_number;
  var gu_course_name = "a" //req.body.gu_course_name;

  pool.query("DELETE FROM course_equivalencies WHERE host_program = ? AND host_course_name = ? AND host_course_number = ? AND gu_course_number = ?",
  [host_program, host_course_name, host_course_number, gu_course_number], function(deleteError, queryResult) {
    if(deleteError) {
      res.send("Error deleting course from database");
    } else if(queryResult.affectedRows == 0) {
      console.log("NOPE, record doesn't exist");
      res.send("recored does not exist in the database");
    }
    else {
      console.log("YES");
      res.send(queryResult);
    }
  })
})

//EDIT A COURSE IN THE EQUIVALENCY TABLE
app.get('/courses/editcourse' function(req, res) {

})
app.listen(port, function() {
    console.log("HI")
    console.log('Listening on port ' + port);
});

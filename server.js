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
    pool.query("SELECT * FROM course_equivalencies",
    function(queryError, queryResult) {
      if(queryError) {
        res.send(queryError);
      } else {
        res.send(queryResult);
      }
    });
});

//ADD A COURSE TO THE EQUIVALENCY TABLE
app.post('/addcourse', function(req, res) {
  var host_program = req.body.host_program;
  var host_course_number = req.body.host_course_number;
  var host_course_name = req.body.host_course_name;
  var gu_course_number = req.body.gu_course_number;
  var gu_course_name = req.body.gu_course_name;
  var comments = req.body.comments;
  var signature_needed = req.body.signature_needed;
  var approved_by = req.body.approved_by;
  var approval_date = req.body.approval_date;
  var approved_until = req.body.approved_until;
  var department = req.body.department;
  pool.query("INSERT INTO course_equivalencies (host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, comments, signature_needed," +
  " department, approved_by, approval_date, approved_until) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
  [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, comments, signature_needed, department, approved_by, approval_date, approved_until],
  function(addError, addResult) {
    if(addError) {
      console.log(addError);
      res.send(addError);
    } else {
      console.log("COURSE ADDED");
      res.send(addResult);
    }
  });
});

//DELETE A COURSE FROM THE EQUIVALENCY TABLE
app.post('/deletecourse', function(req, res) {
  var id = req.body.id;
  pool.query("DELETE FROM course_equivalencies WHERE id = ?", [id], function(deleteError, deleteResult) {
    if(deleteError) {
      res.send(deleteError);
    } else if(result.affectedRows === 0) {
      res.send("Course does not exist");
    } else {
      res.send(deleteResult);
    }
  });
});

//EDIT A COURSE IN THE EQUIVALENCY TABLE
app.post('/editcourse', function(req, res) {
  var id = req.body.id;
  var host_program = req.body.host_program;
  var host_course_number = req.body.host_course_number;
  var host_course_name = req.body.host_course_name;
  var gu_course_number = req.body.gu_course_number;
  var gu_course_name = req.body.gu_course_name;
  var comments = req.body.comments;
  var signature_needed = req.body.signature_needed;
  var approved_by = req.body.approved_by;
  var approval_date = req.body.approval_date;
  var approved_until = req.body.approved_until;
  var department = req.body.department;
  pool.query("UPDATE course_equivalencies SET host_program = ?, host_course_number = ?," +
  " host_course_name = ?, gu_course_number = ?, gu_course_name = ?, comments = ?," +
  " signature_needed = ?, department = ?, approved_by = ?, approval_date = ?, approved_until = ?" +
  " WHERE id = ?",
  [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, comments, signature_needed, department, approved_by, approval_date, approved_until, id],
  function(editError, editResult) {
    if(editError) {
      console.log(editError);
      res.send(editError);
    } else {
      console.log("COURSE MODIFIED");
      res.send(editResult);
    }
  });
});

//get all of the depts
//returns all the courses that are in the department
app.get('/departments', function(req, res) {
  var department = req.body.department;
  pool.query("SELECT host_program, host_course_name, host_course_number, gu_course_name, gu_course_number FROM course_equivalencies WHERE department = ?",
  [department],
  function (deptError, deptResult) {
    if(deptError) {
      console.log("Department doesn't exist");
      res.send(editError);
    } else {
      console.log("Courses have been found");
      res.send(deptResult);
    }
  });
});

//get all the programs
app.get('/programs', function(req, res) {
  var program = req.body.program;
  pool.query("SELECT host_program, host_course_name, host_course_number, gu_course_name, gu_course_number FROM course_equivalencies WHERE host_program = ?",
  [program],
  function(programError, programResult) {
    if(programError) {
      console.log("Program doesn't exist");
      res.send(programError);
    } else {
      console.log("The program has been found: " + programResult);
      res.send(programResult);
    }
  });
});

//get all the subjects
app.get('/subjects', function(req, res) {
  var subject = req.body.subject
  pool.query("SELECT host_program, host_course_name, host_course_number, gu_course_name, gu_course_number FROM course_equivalencies c JOIN subjects s ON (SUBSTRING(c.gu_course_number,1,4) = s.subject_code) WHERE s.subject_code = ? OR s.subject_name = ?",
  [subject],
  function(subjError, subjResult) {
    if(subjError) {
      res.send(subjError);
      console.log("error, cannot find subject");
    } else {
      res.send(subjResult);
      console.log("Success. got the subject");
    }
  });
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

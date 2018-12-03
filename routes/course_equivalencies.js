//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');
var mySQL = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');

//Setting up params for DB connection to the SQL database
//Using ClearDB to maintain database connection through Heroku server
var pool = mySQL.createPool({
  connectionLimit: 100,
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb1f6f893c4a2e',
  password: '12aba883',
  database: 'heroku_6d22e6ede03be83'
});

const router = express.Router()
router.get('/courseRouter', (req, res) => {
  console.log("You have access to the course_equivalencies.js file")
  res.end()
})


//COURSE EQUIVALENCY PAGE
router.get('/courses', function(req, res) {
  console.log("routed to the courses api")
    pool.query("SELECT * FROM course_equivalencies",
    function(queryError, queryResult) {
      if(queryError) {
        res.send(queryError);
      } else {
        res.send(queryResult);
      }
    });
});

// //ADD A COURSE TO THE EQUIVALENCY TABLE
router.post('/addcourse', function(req, res) {
  console.log("You have been routed to the addcourse")
  var host_program = req.body.host_program;
  var host_course_number = req.body.host_course_number;
  var host_course_name = req.body.host_course_name;
  var gu_course_number = req.body.gu_course_number;
  var gu_course_name = req.body.gu_course_name;
  var core = req.body.core;
  var comments = req.body.comments;
  var signature_needed = req.body.signature_needed;
  var approved_by = req.body.approved_by;
  var approval_date = req.body.approval_date;
  var approved_until = req.body.approved_until;
  var department = req.body.department;
  pool.query("INSERT INTO course_equivalencies (host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, core, comments, signature_needed," +
  " department, approved_by, approval_date, approved_until) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
  [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, core, comments, signature_needed, department, approved_by, approval_date, approved_until],
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

// //DELETE A COURSE FROM THE EQUIVALENCY TABLE
router.post('/deletecourse', (req, res) => {
  console.log("routed to the delete course api")
  var id = req.body.id;
  pool.query("DELETE FROM course_equivalencies WHERE id = ?", [id], function(deleteError, deleteResult) {
    if(deleteError) {
      res.send(deleteError);
    } else if(deleteResult.affectedRows === 0) {
      res.send("Course does not exist");
    } else {
      res.send(deleteResult);
    }
  });
});
//
// //EDIT A COURSE IN THE EQUIVALENCY TABLE
router.post('/editcourse', (req, res) => {
  console.log("routed to the edit course api")
  var id = req.body.id;
  var host_program = req.body.host_program;
  var host_course_number = req.body.host_course_number;
  var host_course_name = req.body.host_course_name;
  var gu_course_number = req.body.gu_course_number;
  var gu_course_name = req.body.gu_course_name;
  var core = req.body.core;
  var comments = req.body.comments;
  var signature_needed = req.body.signature_needed;
  var approved_by = req.body.approved_by;
  var approval_date = req.body.approval_date;
  var approved_until = req.body.approved_until;
  var department = req.body.department;
  pool.query("UPDATE course_equivalencies SET host_program = ?, host_course_number = ?," +
  " host_course_name = ?, gu_course_number = ?, gu_course_name = ?, core = ?, comments = ?," +
  " signature_needed = ?, department = ?, approved_by = ?, approval_date = ?, approved_until = ?" +
  " WHERE id = ?",
  [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, core, comments, signature_needed, department, approved_by, approval_date, approved_until, id],
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
//
//
router.get('/programs', function(req, res) {
  console.log("You have been routed to the programs")
  pool.query("SELECT DISTINCT host_program FROM course_equivalencies", function(err, result) {
    if(err) {
      console.log("Cannot get programs");
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
//
//
router.post('/filterbysubject', (req, res) => {
  console.log("routed to the filter by subject api")
  var subjects = req.body.subjects;
  var queryStr = "SELECT c.host_program, c.host_course_name, c.host_course_number, c.gu_course_name, c.gu_course_number " +
    "\nFROM course_equivalencies c " +
    "\nINNER JOIN subjects s ON SUBSTRING(c.gu_course_number,1,4) = s.subject_code " +
    "\nWHERE s.subject_name = \'" + subjects[0] + "\'";
  if(subjects.length > 1) {
    for(var i = 1; i < subjects.length; i++) {
       queryStr += "\nOR s.subject_name = \'" + subjects[i] + "\'";
    }
  }
  queryStr += "\nORDER BY c.host_program ASC";
  pool.query(queryStr,
  function(subjError, subjResult) {
    if(subjError) {
      res.send(subjError);
    } else {
      res.send(subjResult);
    }
  });
});

module.exports = router

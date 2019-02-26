var pool = require('../pool.js');

module.exports = {
  // here, we want to store the information that
  // the student inputs into the curvey
  submitSurvey(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var major = req.body.major;
    var program = req.body.program;
    var term = req.body.term;
    var calendar_year = req.body.calendar_year;
    var year = req.body.year;
    var residence = req.body.residence;
    var trips = req.body.trips;
    var classes = req.body.classes;
    var activities = req.body.activities;
    var staff = req.body.staff;
    var timestamp = req.body.timestamp;
    var approved = 0;

    pool.query("INSERT INTO survey (name, email, major, program, term, calendar_year, year, residence, trips, classes, activities, staff, approved, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [name, email, major, program, term, calendar_year, year, residence, trips, classes, activities, staff, approved, timestamp],
    function(queryError, queryResult) {
      if(queryError) {
        console.log(queryError);
        res.send(queryError);
      } else {
        console.log("Survey entry received");
        res.send(queryResult);
      }
    });
  },

  // Get approved surveys for a program
  programSurveys(req, res) {
    var program = req.body.program;

    pool.query("SELECT * FROM survey WHERE program = ? AND approved = 1", [program],
    function(queryError, queryResult) {
      if (queryError) {
        console.log("Cannot get surveys for program: " + program + "\nError: " + queryError);
        res.send(queryError);
      } else {
        console.log("Program: " + program + " survey results");
        console.log(queryResult);
        res.send(queryResult);
      }
    });
  },

  getUnapprovedSurveys(req, res) {
    pool.query("SELECT p.url, p.height, p.width, s.ID, s.name, s.email, s.major, " +
    "s.program, s.term, s.calendar_year, s.year, s.residence, s.trips, s.classes, " +
    "s.activities, s.staff, s.approved, s.timestamp from survey s LEFT OUTER JOIN photos " +
    "p ON s.ID = p.survey_id WHERE s.approved = 0", function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
  },

  getApprovedSurveys(req, res) {
    pool.query("SELECT p.url, p.height, p.width, s.ID, s.name, s.email, s.major, " +
    "s.program, s.term, s.calendar_year, s.year, s.residence, s.trips, s.classes, " +
    "s.activities, s.staff, s.approved, s.timestamp from survey s LEFT OUTER JOIN photos " +
    "p ON s.ID = p.survey_id WHERE s.approved = 1", function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
  },

  getSurveys(req, res) {
    pool.query("SELECT p.url, p.height, p.width, s.ID, s.name, s.email, s.major, " +
    "s.program, s.term, s.calendar_year, s.year, s.residence, s.trips, s.classes, " +
    "s.activities, s.staff, s.approved, s.timestamp from survey s LEFT OUTER JOIN photos " +
    "p ON s.ID = p.survey_id", function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
  },

  deleteSurvey(req, res) {
    var id = req.body.id;
    pool.query("DELETE FROM survey WHERE ID = ?", [id], function(err, result) {
      if(err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  },

  approveSurvey(req, res) {
    var id = req.body.id;
    pool.query("UPDATE survey SET approved = 1 WHERE id = ?", [id], function(err, result) {
      if(err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
}

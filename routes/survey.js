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
    var other = req.body.other;

    pool.query("INSERT INTO survey (name, email, major, program, term, calendar_year, year, residence, trips, classes, activities, staff, other) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [name, email, major, program, term, calendar_year, year, residence, trips, classes, activities, staff, other],
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

  programSurveys(req, res) {
    var program = req.body.program;

    pool.query("SELECT * FROM survey WHERE program = ?", [program],
    function(queryError, queryResult) {
      if (queryError) {
        console.log("Cannot get surveys for program: " + program + "\nError: " + queryError);
        res.send(queryError);
      } else {
        console.log("Program: " + program + " survey results");
        res.send(queryResult);
      }
    });
  },

  getSubmittedSurveys(req, res) {
    var approved = 0;
      pool.query("SELECT * from survey JOIN photos where approved = ? AND survey.ID = photos.survey_id", [approved], function(error, result) {
        if(error) {
          res.send(error);
          console.log("Cannot get surveys");
        } else {
          console.log("Here are the surveys that need approval");
          res.send(result);
        }
      })
  }
}

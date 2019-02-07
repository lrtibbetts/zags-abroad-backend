var pool = require('../pool.js');

module.exports = {
  // here, we want to store the information that
  // the student inputs into the curvey
  submitSurvey(req, res) {
    var major = req.body.major;
    var program = req.body.program;
    var year = req.body.year;
    var term = req.body.term;
    var residence = req.body.residence;
    var trips = req.body.trips;
    var classes = req.body.classes;
    var activities = req.body.activities;
    var other = req.body.other;
    var name = req.body.name;
    var email = req.body.email;
    var staff = req.body.staff;

    pool.query("INSERT INTO survey (major, program, term, year, residence, trips, classes, activities, other, name, email, staff) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [major, program, term, year, residence, trips, classes, activities, other, name, email, staff],
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
  }
}

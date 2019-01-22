var pool = require('../pool.js');

module.exports = {
  //GET ALL SUBJECTS
  //no filters applied
  getSubjects(req, res) {
    pool.query("SELECT subject_code, subject_name FROM subjects ORDER BY subject_name ASC",
      function(subjError, subjResult) {
        if(subjError) {
          console.log("Cannot get subjects");
          res.send(subjError);
        } else {
          res.send(subjResult);
        }
      });
  },

  programSubjects(req, res) {
    var program = req.body.program;
    pool.query("SELECT DISTINCT s.subject_name, s.subject_code FROM subjects s JOIN course_equivalencies c " +
    "WHERE s.subject_code = SUBSTRING(gu_course_number, 1, 4) AND c.host_program = ? ORDER BY s.subject_name ASC", [program],
      function(queryError, queryResult) {
        if(queryError) {
          console.log("Cannot get subjects for program: " + program);
          res.send(queryError);
        } else {
          res.send(queryResult);
        }
      });
  }
};

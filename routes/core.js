var pool = require('../pool.js');

module.exports = {
  //GET ALL CORE DESIGNATIONS
  getCore(req, res) {
    pool.query("SELECT * FROM core_designations", function(coreError, coreResult) {
      if(coreError) {
        console.log("Cannot get core designations");
        res.send(coreError);
      } else {
        res.send(coreResult);
      }
    });
  },

  //GET CORE OF A PROGRAM
  coreSubjects(req, res) {
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

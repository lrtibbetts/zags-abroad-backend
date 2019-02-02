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
    var core = getCore(req.body.program);
    console.log(core);
    res.send(core);
    // pool.query("SELECT DISTINCT c.core_name FROM core c JOIN course_equivalencies e " +
    // "WHERE e.core LIKE '%c.core_name,%' LIKE AND e.host_program = ? ORDER BY c.core_name ASC", [program],
    //   function(queryError, queryResult) {
    //     if(queryError) {
    //       console.log("Cannot get core for program: " + program);
    //       res.send(queryError);
    //     } else {
    //       res.send(queryResult);
    //     }
    //   });
  }
};

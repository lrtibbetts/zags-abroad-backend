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

<<<<<<< HEAD
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
=======
  programCore(req, res) {
    var program = req.body.program;
    pool.query("SELECT DISTINCT c.core_name FROM core_designations c JOIN course_equivalencies e" +
    " WHERE e.host_program = ? AND e.core LIKE CONCAT('%', c.core_name, ',%')", [program], function(err, result) {
      if(err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
>>>>>>> 1defa5ae922dbb96b8172f060bced84004b26c01
  }
};

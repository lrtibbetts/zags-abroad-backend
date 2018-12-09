var pool = require('../pool.js');

module.exports = {
  //GET ALL PROGRAMS
  getPrograms(req, res) {
    pool.query("SELECT DISTINCT host_program FROM course_equivalencies ORDER BY host_program ASC", function(programError, programResult) {
      if(programError) {
        console.log("Cannot get programs");
        res.send(programError);
      } else {
        res.send(programResult);
      }
    });
  }
};

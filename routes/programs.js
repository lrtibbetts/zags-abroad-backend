var pool = require('../pool.js');

module.exports = {
  //GET ALL PROGRAMS
  getPrograms(req, res) {
    pool.query("SELECT host_program FROM programs ORDER BY host_program ASC", function(programError, programResult) {
      if(programError) {
        console.log("Cannot get programs");
        res.send(programError);
      } else {
        res.send(programResult);
      }
    });
  }
};

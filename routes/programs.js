var pool = require('../pool.js');

module.exports = {
  //GET ALL PROGRAMS
  getPrograms(req, res) {
    pool.query("SELECT DISTINCT host_program FROM course_equivalencies ORDER BY host_program ASC", function(err, result) {
      if(err) {
        console.log("Cannot get programs");
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
};

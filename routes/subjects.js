var pool = require('../pool.js');

module.exports = {
  //GET ALL SUBJECTS
  //no filters applied
  getSubjects(req, res) {
    pool.query("SELECT subject_name FROM subjects ORDER BY subject_name ASC", function(subjError, subjResult) {
      if(subjError) {
        console.log("Cannot get subjects");
        res.send(subjError);
      } else {
        res.send(subjResult);
      }
    });
  }
};

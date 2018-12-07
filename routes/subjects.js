var pool = require('../pool.js');

module.exports = {
  //GET ALL SUBJECTS
  //no filters applied
  getSubjects(req, res) {
    pool.query("SELECT subject_name FROM subjects ORDER BY subject_name ASC", function(err, result) {
      if(err) {
        console.log("Cannot get subjects");
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
};

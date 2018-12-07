var pool = require('../pool.js');

module.exports = {
  //GET ALL DEPARTMENTS
  getDepartments(req, res) {
    pool.query("SELECT dept_code FROM departments ORDER BY dept_code ASC", function(err, result) {
      if(err) {
        console.log("Cannot get departments");
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
};

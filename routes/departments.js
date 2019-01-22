var pool = require('../pool.js');

module.exports = {
  //GET ALL DEPARTMENTS
  getDepartments(req, res) {
    pool.query("SELECT dept_code FROM departments ORDER BY dept_code ASC",
      function(deptError, deptResult) {
        if(deptError) {
          console.log("Cannot get departments");
          res.send(deptError);
        } else {
          res.send(deptResult);
        }
    });
  }
};

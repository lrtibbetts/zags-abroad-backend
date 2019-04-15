var pool = require('../pool.js');
require('dotenv').config();

module.exports = {
  /* Get all core designations */
  getCore(req, res) {
    pool.query("SELECT * FROM core_designations ORDER BY core_name ASC", function(coreError, coreResult) {
      if(coreError) {
        console.log("Cannot get core designations");
        res.send(coreError);
      } else {
        res.send(coreResult);
      }
    });
  },

  /* Get core designations for a specific program */
  programCore(req, res) {
    var program = req.body.program;
    pool.query("SELECT DISTINCT c.core_name FROM core_designations c JOIN course_equivalencies e" +
    " WHERE e.host_program = ? AND e.core LIKE CONCAT('%', c.core_name, ',%') ORDER BY c.core_name ASC", [program], function(err, result) {
      if(err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
};

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

  programCore(req, res) {
    pool.query("SELECT DISTINCT c.core_name FROM core_designations c JOIN course_equivalencies e" +
    " WHERE e.core LIKE CONCAT('%', c.core_name, ',%')", function(coreError, coreResult) {
      if(coreError) {
        console.log("Cannot get core designations");
        res.send(coreError);
      } else {
        res.send(coreResult);
      }
    });
  }
};

var pool = require('../pool.js');

module.exports = {
  //GET ALL PROGRAMS
  getPrograms(req, res) {
    pool.query("SELECT host_program FROM programs ORDER BY host_program ASC",
      function(programError, programResult) {
        if(programError) {
          console.log("Cannot get programs");
          res.send(programError);
        } else {
          res.send(programResult);
        }
      });
  },

  // GET PROGRAM INFOMRATION TO POPULATE ADMIN MANAGEMENT PAGE
  getAdminPrograms(req, res){
    pool.query("SELECT * FROM programs ORDER BY host_program ASC",
      function(programError, programResult) {
        if(programError) {
          console.log("Cannot get programs");
          res.send(programError);
        } else {
          res.send(programResult);
        }
      });
  },

  getLocations(req, res) {
    pool.query("SELECT host_program, city, lat, lng FROM programs",
      function(locationError, locationResult) {
        if(locationError) {
          res.send(locationError);
        } else {
          res.send(locationResult);
        }
      });
  }
};

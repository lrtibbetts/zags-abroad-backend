var pool = require('../pool.js');

module.exports = {
  //GET ALL PROGRAMS
  getPrograms(req, res) {
    pool.query("SELECT host_program FROM programs ORDER BY host_program ASC",
      function(programError, programResult) {
        if(programError) {
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
          res.send(programError);
        } else {
          res.send(programResult);
        }
      });
  },

  // GET LOCATIONS for MapView
  getLocations(req, res) {
    pool.query("SELECT host_program, city, lat, lng FROM programs",
      function(locationError, locationResult) {
        if(locationError) {
          res.send(locationError);
        } else {
          res.send(locationResult);
        }
      });
  },

  // ADD A PROGRAM TO PROGRAM TABLE
  // allows admin to add program to the program table
  addProgram(req, res) {
    var host_program = req.body.host_program;
    var program_type = req.body.program_type;
    var host_url = req.body.host_url;
    var application_link = req.body.application_link;
    var city = req.body.city;
    var lat = req.body.lat;
    var lng = req.body.lng;
    pool.query("INSERT INTO programs (host_program, program_type, host_url, application_link, city, lat, lng) VALUES (?,?,?,?,?,?,?)",
    [host_program, program_type, host_url, application_link, city, lat, lng],
    function(addError, addResult) {
      if(addError) {
        res.send(addError);
      } else {
        res.send(addResult);
      }
    });
  },

  //EDIT A COURSE IN THE EQUIVALENCY TABLE
  editProgram(req, res) {
    var host_program = req.body.host_program;
    var program_type = req.body.program_type;
    var host_url = req.body.host_url;
    var application_link = req.body.application_link;
    var city = req.body.city;
    var orig_host_program = req.body.orig_host_program;
    var lat = req.body.lat;
    var lng = req.body.lng;
    pool.query("UPDATE programs SET host_program = ?, program_type = ?, host_url = ?," +
    " application_link = ?, city = ?, lat = ?, lng = ? WHERE host_program = ?",
    [host_program, program_type, host_url, application_link, city, lat, lng, orig_host_program],
    function(editError, editResult) {
      if(editError) {
        res.send(editError);
      } else {
        res.send(editResult);
      }
    });
  },

  //DELETE A COURSE FROM THE EQUIVALENCY TABLE
  deleteProgram(req, res) {
    var host_program = req.body.host_program;
    pool.query("DELETE FROM programs WHERE host_program = ?", [host_program],
    function(deleteError, deleteResult) {
      if(deleteError) {
        res.send(deleteError);
      } else if(deleteResult.affectedRows === 0) {
        res.send("Program does not exist");
      } else {
        res.send(deleteResult);
      }
    });
  }
};

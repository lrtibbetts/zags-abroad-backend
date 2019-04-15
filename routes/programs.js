var pool = require('../pool.js');

module.exports = {
  /* Get all program names */
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

  /* Get all program details (used on admin program management page)*/
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

  /* Get locations for map view */
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

  /* Get application link for a given program */
  getApplicationLink(req, res) {
    var host_program = req.body.host_program;
    pool.query("SELECT application_link FROM programs WHERE host_program = ?", [host_program],
      function(linkError, linkResult) {
        if(linkError) {
          res.send(linkError);
        } else {
          res.send(linkResult);
        }
      });
  },

  /* Add a new program */
  addProgram(req, res) {
    var host_program = req.body.host_program;
    var program_type = req.body.program_type;
    var application_link = req.body.application_link;
    var city = req.body.city;
    var lat = req.body.lat;
    var lng = req.body.lng;
    pool.query("INSERT INTO programs (host_program, program_type, application_link, city, lat, lng) VALUES (?,?,?,?,?,?)",
    [host_program, program_type, application_link, city, lat, lng],
    function(addError, addResult) {
      if(addError) {
        res.send(addError);
      } else {
        res.send(addResult);
      }
    });
  },

  /* Update a program */
  editProgram(req, res) {
    var host_program = req.body.host_program;
    var program_type = req.body.program_type;
    var application_link = req.body.application_link;
    var city = req.body.city;
    var orig_host_program = req.body.orig_host_program;
    var lat = req.body.lat;
    var lng = req.body.lng;
    pool.query("UPDATE programs SET host_program = ?, program_type = ?," +
    " application_link = ?, city = ?, lat = ?, lng = ? WHERE host_program = ?",
    [host_program, program_type, application_link, city, lat, lng, orig_host_program],
    function(editError, editResult) {
      if(editError) {
        res.send(editError);
      } else {
        res.send(editResult);
      }
    });
  },

  /* Delete a program */
  deleteProgram(req, res) {
    var host_program = req.body.host_program;
    pool.query("DELETE FROM programs WHERE host_program = ?", [host_program],
    function(deleteError, deleteResult) {
      if(deleteError) {
        res.send(deleteError);
      } else if(deleteResult.affectedRows === 0) {
        res.send("Program does not exist");
      } else {
        // Delete corresponding courses
        pool.query("DELETE FROM course_equivalencies WHERE host_program = ?", [host_program],
        function(deleteCoursesError, deleteCoursesResult) {
          if(deleteCoursesError) {
            res.send(deleteCoursesError);
          } else {
            res.send(deleteCoursesResult);
          }
        });
      }
    });
  }
};

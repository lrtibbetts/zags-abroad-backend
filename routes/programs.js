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
    pool.query("INSERT INTO programs (host_program, program_type, host_url, application_link, city) VALUES (?,?,?,?,?)",
    [host_program, program_type, host_url, application_link, city],
    function(addError, addResult) {
      if(addError) {
        console.log(addError);
        res.send(addError);
      } else {
        console.log("PROGRAM " + host_program + " ADDED");
        res.send(addResult);
      }
    });
  }/*,

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
  }//,*/

  //EDIT A COURSE IN THE EQUIVALENCY TABLE
  /*editCourse(req, res) {
    var id = req.body.id;
    var host_program = req.body.host_program;
    var host_course_number = req.body.host_course_number;
    var host_course_name = req.body.host_course_name;
    var gu_course_number = req.body.gu_course_number;
    var gu_course_name = req.body.gu_course_name;
    var core = req.body.core;
    var comments = req.body.comments;
    var signature_needed = req.body.signature_needed;
    var approved_by = req.body.approved_by;
    var approval_date = req.body.approval_date;
    var approved_until = req.body.approved_until;
    var department = req.body.department;
    pool.query("UPDATE course_equivalencies SET host_program = ?, host_course_number = ?," +
    " host_course_name = ?, gu_course_number = ?, gu_course_name = ?, core = ?, comments = ?," +
    " signature_needed = ?, department = ?, approved_by = ?, approval_date = ?, approved_until = ?" +
    " WHERE id = ?",
    [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, core, comments, signature_needed, department, approved_by, approval_date, approved_until, id],
    function(editError, editResult) {
      if(editError) {
        console.log(editError);
        res.send(editError);
      } else {
        console.log("COURSE MODIFIED");
        res.send(editResult);
      }
    });
  }*/
};

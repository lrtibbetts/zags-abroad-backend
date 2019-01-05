var pool = require('../pool.js');

module.exports = {
  //COURSE EQUIVALENCY PAGE
  //this selects all of the courses
  //we are selecting all the columns but will only show a few important row
  getCourses(req, res) {
      pool.query("SELECT * FROM course_equivalencies",
      function(queryError, queryResult) {
        if(queryError) {
          res.send(queryError);
        } else {
          res.send(queryResult);
        }
      });
  },

  //ADD A COURSE TO THE EQUIVALENCY TABLE
  //allows admin to add courses to the course equivalency table
  addCourse(req, res) {
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
    pool.query("INSERT INTO course_equivalencies (host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, core, comments, signature_needed," +
    " department, approved_by, approval_date, approved_until) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [host_program, host_course_number, host_course_name, gu_course_number, gu_course_name, core, comments, signature_needed, department, approved_by, approval_date, approved_until],
    function(addError, addResult) {
      if(addError) {
        console.log(addError);
        res.send(addError);
      } else {
        console.log("COURSE ADDED");
        res.send(addResult);
      }
    });
  },

  //DELETE A COURSE FROM THE EQUIVALENCY TABLE
  deleteCourse(req, res) {
    var id = req.body.id;
    pool.query("DELETE FROM course_equivalencies WHERE id = ?", [id], function(deleteError, deleteResult) {
      if(deleteError) {
        res.send(deleteError);
      } else if(deleteResult.affectedRows === 0) {
        res.send("Course does not exist");
      } else {
        res.send(deleteResult);
      }
    });
  },

  //EDIT A COURSE IN THE EQUIVALENCY TABLE
  editCourse(req, res) {
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
  },

  //SUBJECT FILTERS
  //return course equivalencies with GU courses that apply to subjects in filter
  filterBySubject(req, res) {
    //var subject = req.body.subject
    var subjects = req.body.subjects;
    var queryStr = "SELECT c.host_program, c.host_course_name, c.host_course_number, c.gu_course_name, c.gu_course_number, c.signature_needed" +
      "\nFROM course_equivalencies c " +
      "\nINNER JOIN subjects s ON SUBSTRING(c.gu_course_number,1,4) = s.subject_code " +
      "\nWHERE s.subject_name = \'" + subjects[0] + "\'";
    if(subjects.length > 1) {
      for(var i = 1; i < subjects.length; i++) {
         queryStr += "\nOR s.subject_name = \'" + subjects[i] + "\'";
      }
    }
    queryStr += "\nORDER BY c.host_program, c.gu_course_number ASC";
    pool.query(queryStr,
    function(subjError, subjResult) {
      if(subjError) {
        res.send(subjError);
      } else {
        res.send(subjResult);
      }
    });
  }

};

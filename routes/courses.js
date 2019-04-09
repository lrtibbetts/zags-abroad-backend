var pool = require('../pool.js');
require('dotenv').config();

module.exports = {
  getCourses(req, res) {
      pool.query("SELECT * FROM course_equivalencies c JOIN programs p WHERE c.host_program = p.host_program ORDER BY c.host_program, c.gu_course_number ASC",
      function(queryError, queryResult) {
        if(queryError) {
          res.send(queryError);
        } else {
          res.send(queryResult);
        }
      });
  },

  /*
    Get courses for a specific study abroad program
  */
  programCourses(req, res) {
    var program = req.body.program;
    pool.query("SELECT id, host_program, host_course_name, host_course_number, gu_course_name, gu_course_number, signature_needed, core" +
      " FROM course_equivalencies WHERE host_program = ? ORDER BY gu_course_number ASC", [program],
    function(queryError, queryResult) {
      if(queryError) {
        res.send(queryError);
      } else {
        res.send(queryResult);
      }
    });
  },

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
        res.send(addError);
      } else {
        res.send(addResult);
      }
    });
  },

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
        res.send(editError);
      } else {
        res.send(editResult);
      }
    });
  },

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

  /*
    Filtering on Main Program Search Page: Return course equivalencies with GU courses that match filter(s)
  */
  mainSearch(req, res) {
    var subjects = req.body.subjects;
    var core = req.body.core;
    if(core.length === 0) {
      pool.query("SELECT * FROM course_equivalencies c JOIN programs p ON " +
      "c.host_program = p.host_program WHERE SUBSTRING(c.gu_course_number,1,4) IN (?) ORDER BY c.host_program, c.gu_course_number ASC",
        [subjects, core], function(err, result) {
        if(err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    } else {
      var str = "SELECT * FROM course_equivalencies c JOIN programs p ON " +
      "c.host_program = p.host_program WHERE c.core LIKE '%" + core[0] + ",%'";
      for(var i = 1; i < core.length; i++) {
        str += " OR c.core LIKE '%" + core[i] + ",%'";
      }
      if(subjects.length > 0) {
        str += " OR SUBSTRING(c.gu_course_number,1,4) IN (?)";
      }
      str += " ORDER BY c.host_program, c.gu_course_number ASC";
      pool.query(str, subjects, function(err, result) {
        if(err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    }
  },

  /*
    Filtering on Detail View Page: Return course equivalencies with GU courses that match filter(s)
  */
  detailSearch(req, res) {
    var program = req.body.program;
    var subjects = req.body.subjects;
    var core = req.body.core;
    if(core.length === 0) {
      pool.query("SELECT id, host_program, host_course_name, host_course_number, gu_course_name, gu_course_number, signature_needed, core" +
        " FROM course_equivalencies WHERE host_program = ? AND SUBSTRING(gu_course_number,1,4) IN (?) ORDER BY gu_course_number ASC",
        [program, subjects], function(err, result) {
        if(err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    } else {
      var str = "SELECT id, host_program, host_course_name, host_course_number, gu_course_name, gu_course_number, signature_needed, core" +
        " FROM course_equivalencies WHERE host_program = ? AND (core LIKE '%" + core[0] + ",%'";
      for(var i = 1; i < core.length; i++) {
        str += " OR core LIKE '%" + core[i] + ",%'";
      }
      if(subjects.length > 0) {
        str += " OR SUBSTRING(gu_course_number,1,4) IN (?)";
      }
      str += ") ORDER BY gu_course_number ASC";
      pool.query(str, [program, subjects], function(err, result) {
        if(err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    }
  }
};

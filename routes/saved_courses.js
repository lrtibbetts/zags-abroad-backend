var pool = require('../pool.js');

module.exports = {
  //SAVE COURSE
  saveCourse(req, res) {
    var email = req.body.email;
    var course_id = req.body.course_id;
    pool.query("INSERT INTO saved_courses (email, course_id) VALUES (?,?)", [email, course_id],
      function(saveError, saveResult) {
        if(saveError) {
          console.log("Cannot save course");
          res.send(saveError);
        } else {
          console.log("COURSE SAVED");
          res.send(saveResult);
        }
      });
  },

  //MY ACCOUNT Courses
  accountCourses(req, res) {
    var email = req.body.email;
    pool.query("SELECT c.id, c.host_program, c.host_course_number, c.host_course_name, c.gu_course_number, c.gu_course_name, c.signature_needed " +
    "FROM course_equivalencies c JOIN saved_courses s WHERE s.email = ? AND c.id = s.course_id ORDER BY c.host_program ASC", [email],
      function(accError, accResult) {
        if(accError) {
          console.log("Cannot access account");
          res.send(accError);
        } else {
          console.log("Account courses retrieved");
          res.send(accResult);
        }
      });
  }
};

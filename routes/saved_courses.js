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
  }
};

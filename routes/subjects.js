//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');
 
const router = express.Router()
console.log("subjects.js accessed")
//get all subjects...no filter applied
router.get('/subjects', function(req, res) {
  pool.query("SELECT subject_name FROM subjects ORDER BY subject_name ASC", function(err, result) {
    if(err) {
      console.log("Cannot get subjects");
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router

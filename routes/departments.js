//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');

const router = express.Router()
console.log("departments.js accessed");


//get all of the depts 
router.get('/departments', function(req, res) {
  console.log("You are getting the list of departments")
  pool.query("SELECT dept_code FROM departments", function(err, result) {
    if(err) {
      console.log("Cannot get departments");
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router

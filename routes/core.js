//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');

const router = express.Router();
console.log("core.js accessed");

router.get('/core', (req, res) => {
  console.log("Routed to the core api")
  pool.query("SELECT * FROM core_designations", function(err, result) {
    if(err) {
      console.log("Cannot get core designations");
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router

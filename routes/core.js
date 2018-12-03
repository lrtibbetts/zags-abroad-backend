//Declaring dependencies that will be used to run 'post' and 'get' requests
var express = require('express');
var mySQL = require('mysql');

//Setting up params for DB connection to the SQL database
//Using ClearDB to maintain database connection through Heroku server
var pool = mySQL.createPool({
  connectionLimit: 100,
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb1f6f893c4a2e',
  password: '12aba883',
  database: 'heroku_6d22e6ede03be83'
});

const router = express.Router();
router.get('/corefile', (req, res) => {
  console.log("You have access to the core.js file");
  res.end()
})

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

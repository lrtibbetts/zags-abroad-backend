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

const router = express.Router()
router.get('/subjRouter', (req, res) => {
  console.log("you are in the subjects.js file")
  res.end()
})

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

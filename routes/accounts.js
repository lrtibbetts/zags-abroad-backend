//contains all of the accounts routes
const express = require('express');

const router = express.Router();
console.log("account.js accessed")
  
//make sure to take into consideration the hard coding of the
//admin value
router.post('/signup', (req, res) => {
  console.log("Routed to the sign up")
  var email = req.body.email;
  var first = req.body.first;
  var last = req.body.last;
  var password = req.body.password;
  var admin = 0;
  // https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt
  bcrypt.hash(password, saltRounds, function(hashError, hash) {
    if (hashError) {
      console.log(hashError);
    } else {
      pool.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin) VALUES (?,?,?,?,?)",
        [email, first, last, hash, admin],
        function(queryError, queryResult) {
          if(queryError) {
            res.send("User already exists");
          } else {
            res.send(queryResult);
          }
        });
    }
  });
});

// //LOGIN PAGE
// //If email does not exist in db, return "Email not found"
// //If email exists but password is incorrect, return "Incorrect password"
// //If valid login, return account info (json)
router.post('/login', (req, res) => {
    console.log("Routed to the login");
    var email = req.body.email;
    var password = req.body.password;
    pool.query("SELECT * FROM accounts WHERE email = ?", [email], function (queryError, queryResult) {
        if(queryError) {
          res.send(queryError);
        } else if(queryResult.length > 0) {
          // Email found
          bcrypt.compare(password, queryResult[0].password, function(bcryptError, bcryptResult) {
            if(bcryptResult){
              res.send(queryResult[0]);
            } else {
              res.send("Incorrect password");
            }
          });
        } else {
          res.send("Email not found");
        }
    });
});

//using the router to export the data
module.exports = router

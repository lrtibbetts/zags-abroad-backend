var pool = require('../pool.js');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var sendmail = require('sendmail')();
const saltRounds = 10;

module.exports = {
  sendEmail(req, res) {
    var fname = req.body.first
    var lname = req.body.last
    var email = req.body.email
    sendmail({
      from: 'zagsabroad@gonzaga.edu',
      to: email,
      subject: 'ITS BRITNEY BITCH',
      html: '<b>Hello ' + fname + " " + lname + "!</b></br> Thank you for signing up for <b><i>Zags Abroad</i></b>. Before you continue to our website, we would love it if you could confirm your email. Please click the link provided",
    }, function(err, reply) {
      if(err) {
        console.log(err);
      } else {
        console.log("email sent")
      }
  });
    // console.log("HElp");
    // var transport = {
    //   service: 'Outlook365',
    // }
    //
    // var transporter = nodemailer.createTransport(transport);
    //
    // transporter.verify((error, success) => {
    //   if(error) {
    //     console.log(error);
    //   } else {
    //     console.log('server is ready to take messages');
    //   }
    // });
    //
    // var name = req.body.first
    // var email = req.body.email
    //
    // var mail = {
    //   from: 'zagsabroad@gonzaga.edu',
    //   to: email,  //Change to email address that you want to receive messages on
    //   subject: 'New Message from Contact Form',
    //   text: "WHATTTT"
    // }
    //
    // transporter.sendMail(mail, (err, data) => {
    //   if (err) {
    //     res.json({
    //       msg: 'fail'
    //     })
    //     console.log(err);
    //   } else {
    //     res.json({
    //       msg: 'success'
    //     })
    //     console.log("check email")
    //   }
    // })

  },
  //SIGN UP PAGE
  //If email is not already in the database, then insert
  //Else, return "User already exists"
  signUp(req, res) {
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
              console.log(queryResult)
            }
          });
      }
    });
  },

  //LOGIN PAGE
  //If email does not exist in db, return "Email not found"
  //If email exists but password is incorrect, return "Incorrect password"
  //If valid login, return account info (json)
  logIn(req, res) {
      var email = req.body.email;
      var password = req.body.password;
      pool.query("SELECT * FROM accounts WHERE email = ?", [email],
        function (queryError, queryResult) {
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
  },

  //ADMIN Approval PAGE
  //we are selecting only the accounts that have gonzaga.edu endings
  //alisha will have the ability to grant administrative access
  getAccounts(req, res) {
    pool.query("SELECT * FROM accounts WHERE email like '%@g%' and email != 'lombardi@gonzaga.edu'", function(error, result) {
      if (error) {
        res.send(error);
        console.log("No @gonzaga.edu accounts found");
      } else {
        res.send(result);
        console.log("Here are the possible admin accounts");
      }
    })
  },

  grantAccess(req, res) {
    var email = req.body.email;
    pool.query("UPDATE accounts SET is_admin = 1 WHERE email = ?", [email], function(error, result) {
      if (error) {
        res.send(error);
        console.log("Error")
      } else {
        res.send(result);
        console.log("Admin access granted to " + email);
      }
    })
  },

  removeAccess(req, res) {
    var email = req.body.email;
    pool.query("UPDATE accounts set is_admin = 0 WHERE email = ? ", [email], function(error, result) {
      if(error) {
        res.send(error);
        console.log("No change in admin privledge");
      } else {
        res.send(error);
        console.log("Now " + email + " has no admin access");
      }
    })
  }

};

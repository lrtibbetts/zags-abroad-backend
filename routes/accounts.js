var pool = require('../pool.js');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var sendmail = require('sendmail')();
const saltRounds = 10;
var verified = false;
var newToken, mailOptions, host, link, person;
require('dotenv').config()

module.exports = {
  //this will be used to send emails to the user
  //we want to call this when they hit the "get started" button on the sign up page
  sendEmail(req, res) {
    var fname = req.body.first
    var lname = req.body.last
    var email = req.body.email
    var password = req.body.password
    person = [fname, lname, email, password];
    console.log("email: "+ email)
    var smtpTransport = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_FOR_VERIFICATION,
        pass: process.env.EMAIL_VERIFICATION_PASS,
      }
    });
    var rand = function() {
        return Math.random().toString(36).substr(2);
    };
    var token = function() {
        return rand() + rand(); // to make it longer
    };

    newToken = token();
    console.log(newToken);
    host=req.get('host');
    link = "https://"+req.get('host')+"/verify?id="+ newToken;
    mailOptions = {
      from: "zagsabroad@gmail.com",
      to: email,
      subject: "ZAGS ABROAD email verification",
      html: "Hello, </br> Please click on the link to verify you email. </br> <a href="+link+">Click here to verify</a>"
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.send({first:fname, last: lname, email:email, password: password, token: newToken, sent: false, host: host})
      } else {
        res.send({first:fname, last: lname, email:email, password: password, token: newToken, sent: true, host: host});
      }
    });

  },

  //we will be using this function to ensure that the email sent a matching token
  verifyEmail(req,res) {
    //we need to pass in the new toke
    if((req.protocol+"s://"+req.get('host'))==("https://"+host)) {
      console.log("Domain matched. information is from authentic email");
      if(req.query.id == newToken) {
        verified = true;
        console.log("email is verified");
        //i want to send all account info back here so that I can then make an account
        pool.query("UPDATE accounts SET is_verified = 1 WHERE email = ?", [person[2]], function(error, result) {
          if (error) {
            console.log("Account has not been updated in the database");
          } else {
            console.log("check the database. the account should be verified");
          }
        })
        res.redirect('https://zagsabroad-backend.herokuapp.com/login')

      } else {
        verified = false;
        console.log("email is not verified");
        res.end("check email")
      }
    } else {
      str = "https://"+host
      res.end("<h1>" +req.protocol+"://"+req.get('host') + "             " + str + "</h1>")

    }
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
      pool.query("SELECT * FROM accounts WHERE email = ? and is_verified = 1", [email],
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

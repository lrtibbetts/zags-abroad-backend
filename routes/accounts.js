var pool = require('../pool.js');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const saltRounds = 10;
require('dotenv').config();
const uuidv1 = require('uuid/v1');

module.exports = {
  sendResetEmail(req, res) {
    var email = req.body.email;
    var smtpTransport = nodemailer.createTransport({
      service: process.env.ACCOUNT_SERVICE,
      auth: {
        user: process.env.ACCOUNT_EMAIL,
        pass: process.env.ACCOUNT_PASS,
      }
    });
    var token = uuidv1();
    var link = "https://zagsabroad.herokuapp.com/reset/" + token;
    var mailOptions = {
      from: process.env.ACCOUNT_EMAIL,
      to: email,
      subject: "Reset your password with Zags Abroad",
      html: "Hello, </br> Please click on the link below to reset your password. </br> <a href="
      + link + ">Click here to reset your password</a>"
    };
    pool.query("UPDATE accounts SET token = ? WHERE email = ?", [token, email], function(error, result) {
      if (error) {
        res.send(error);
      } else if(result.affectedRows === 0) {
        res.send("Account does not exist");
      } else {
        smtpTransport.sendMail(mailOptions, function(error, info) {
          if (error) {
            res.send({sent: false});
          } else {
            res.send({sent: true});
          }
        });
      }
    });
  },

  resetPassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    pool.query("SELECT email FROM accounts WHERE token = ?", [token], function(error, result) {
      if (error) {
        res.send(error);
      } else {
        var email = result[0].email;
        // Hash new password
        bcrypt.hash(password, saltRounds, function(hashError, hash) {
          if (hashError) {
            console.log(hashError);
          } else {
            pool.query("UPDATE accounts SET password = ? WHERE email = ?", [hash, email], function(queryError, queryResult) {
                if(queryError) {
                  res.send(queryError);
                } else {
                  res.send(queryResult);
                }
              });
          }
        });
      }
    });
  },

  verifyEmail(req,res) {
    var token = req.query.id;
    pool.query("SELECT email FROM accounts WHERE token = ?", [token], function(error, result) {
      if (error) {
        res.send(error);
      } else {
        var email = result[0].email;
        pool.query("UPDATE accounts SET is_verified = 1 WHERE email = ?", [email], function(error, result) {
          if (error) {
            res.send(error);
          } else {
            res.redirect('https://zagsabroad.herokuapp.com/login');
          }
        });
      }
    });
  },

  /*
    SIGN UP PAGE
    If email is not already in the database, then insert and send email
    Else, return "User already exists"
  */
  signUp(req, res) {
    var email = req.body.email;
    var first = req.body.first;
    var last = req.body.last;
    var password = req.body.password;
    var admin = 0
    var smtpTransport = nodemailer.createTransport({
      service: process.env.ACCOUNT_SERVICE,
      auth: {
        user: process.env.ACCOUNT_EMAIL,
        pass: process.env.ACCOUNT_PASS,
      }
    });
    // Generate UUID as unique token
    var token = uuidv1();
    var link = "https://" + req.get('host') + "/verify?id=" + token;
    var mailOptions = {
      from: process.env.ACCOUNT_EMAIL,
      to: email,
      subject: "Verify your account with Zags Abroad",
      html: "Hello, </br> Please click on the link below to verify your email. </br> <a href="
      + link + ">Click here to verify</a>"
    };
    // https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt
    bcrypt.hash(password, saltRounds, function(hashError, hash) {
      if (hashError) {
        console.log(hashError);
      } else {
        pool.query("INSERT INTO accounts (email, first_name, last_name, password, is_admin, token) VALUES (?,?,?,?,?,?)",
          [email, first, last, hash, admin, token],
          function(queryError, queryResult) {
            if(queryError) {
              res.send(queryError);
            } else {
              smtpTransport.sendMail(mailOptions, function(error, info) {
                if (error) {
                  res.send({sent: false})
                } else {
                  res.send({sent: true});
                }
              });
            }
          });
      }
    });
  },

  /*
    LOGIN PAGE
    If email does not exist in db, return "Email not found"
    If email exists but password is incorrect, return "Incorrect password"
    If valid login, return account info (json)
  */
  logIn(req, res) {
      var email = req.body.email;
      var password = req.body.password;
      pool.query("SELECT * FROM accounts WHERE email = ?", [email],
        function (queryError, queryResult) {
          if(queryError) {
            res.send(queryError);
          } else if(queryResult.length > 0) {
            if(queryResult[0].is_verified === 0) {
              // Not verified
              res.send("Not verified");
            } else {
              // Email has been verified
              bcrypt.compare(password, queryResult[0].password, function(bcryptError, bcryptResult) {
                if(bcryptResult){
                  res.send(queryResult);
                } else {
                  res.send("Incorrect password");
                }
              });
            }
          } else {
            res.send("Email not found");
          }
      });
  },

  /*
    ADMIN APPROVAL PAGE
    We are selecting only the accounts with email domain gonzaga.edu
    Alisha will have the ability to grant administrative access
  */
  getAccounts(req, res) {
    pool.query("SELECT * FROM accounts WHERE email like '%@g%' and email != 'lombardi@gonzaga.edu'", function(error, result) {
      if (error) {
        res.send(error);
      } else {
        res.send(result);
      }
    })
  },

  grantAccess(req, res) {
    var email = req.body.email;
    pool.query("UPDATE accounts SET is_admin = 1 WHERE email = ?", [email], function(error, result) {
      if (error) {
        res.send(error);
      } else {
        res.send(result);
      }
    })
  },

  removeAccess(req, res) {
    var email = req.body.email;
    pool.query("UPDATE accounts set is_admin = 0 WHERE email = ? ", [email], function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send(error);
      }
    })
  }

};

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../routes/accounts');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);



let signup_details = {
  email: 'kburgett2@zagmail.gonzaga.edu',
  first: 'Kristen',
  last: 'Burgett',
  password: 'password'
};

describe('Sign Up Test', function() {
  var host = 'http://localhost:3001'
  var path = '/signup'

  it('should insert a unique account into the table with the correct information if the account does not already exist POST',
   function(done) {
    chai.request(host).post(path).send(signup_details).end(function(error, response, body) {
      assert.equal(response.request._data.email, signup_details.email)
      assert.equal(response.request._data.first, signup_details.first)
      assert.equal(response.request._data.last, signup_details.last)
      assert.equal(response.request._data.password, signup_details.password)
    });
    done();
  });

  it('should return the status code 200 POST',
   function(done) {
    chai.request(host).post(path).send(signup_details).end(function(error, response, body) {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });


});

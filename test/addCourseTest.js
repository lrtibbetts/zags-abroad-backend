var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../routes/courses');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

let addCourse_details = {
  host_program: "b",
  host_course_number: "a",
  host_course_name: "a",
  gu_course_number: "a",
  gu_course_name: "a",
  core: "a",
  comments: "a",
  signature_needed: "a",
  approved_by: "a",
  approval_date: "a",
  approved_until: "a",
  department: "a"
};


describe('Add Course Test', function() {
  var host = 'http://localhost:3001';
  var path = '/addcourse';

  it('should insert a unique account into the table with the correct information POST',
   function(done) {
    chai.request(host).post(path).send(addCourse_details).end(function(error, response) {
        assert.typeOf(response.req.res.text, 'string')
    });
    done();
  });

  it('should have affectedRows = 1 POST',
   function(done) {
    chai.request(host).post(path).send(addCourse_details).end(function(error, response) {
        expect(response.req.res.text).to.match(/(?:"affectedRows":1)/)
    });
    done();
  });

  it('should return the status code 200',
   function(done) {
    chai.request(host).post(path).send(addCourse_details).end(function(error, response, body) {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });
});

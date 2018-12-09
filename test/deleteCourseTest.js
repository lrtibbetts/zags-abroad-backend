var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../routes/courses');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var request = require('request');

chai.use(chaiHttp);


let deleteCourse_details = {
  id: 73191
};


describe('Delete Course', function() {
  var host = 'http://localhost:3001'
  var path = '/deletecourse'

  it('should delete a course from the course equivalency table given an id',
   function(done) {
    chai.request(host).post(path).send(deleteCourse_details).end(function(error, response) {
        //console.log(response.request._data)
        if (response.req.res.text != 'Course does not exist') {
          expect(response.request._data.id).to.equal(deleteCourse_details.id)
        }
        done();
    })
  })

  //
  it('should return the status code 200',
   function(done) {
    chai.request(host).post(path).send(deleteCourse_details).end(function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    })
  })


});

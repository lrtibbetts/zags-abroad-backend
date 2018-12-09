var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../routes/courses');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.use(chaiHttp);

let edit_course_details = {
  id: 73121,
  host_program: 'Kristen',
  host_course_number: 'Claire',
  host_course_name: 'Lucy',
  gu_course_number: 'Katrina',
  gu_course_name: 'Zags Abroad',
  core: 'Globe is life',
  coments: 'Comment',
  signature_needed: 'Nay',
  approved_by: 'Mom',
  approval_date: '12/12/12',
  approved_until: '',
  department: ''
};

describe('Edit Course Tests', function() {
  var host = 'http://localhost:3001'
  var path = '/editcourse'
  it('should modify a course equivalency on /editcourse POST', function(done) {
     chai.request(host).post(path).send(edit_course_details).end(function(error, response) {
         //console.log(response.text)
         assert.typeOf(response.text, 'string')
         done();
     })
   })

   it('should return \'affectedRows\':1', function(done) {
     chai.request(host).post(path).send(edit_course_details).end(function(error, response) {
         expect(response.text).to.match(/(?:"affectedRows":1)/)
         done();
     })
   })
});

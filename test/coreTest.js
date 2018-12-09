const assert = require('chai').assert;
var chai = require('chai');
const expect = require('chai').expect;
var request = require('request');
const core = require('../routes/core').getCore;

chai.use(require('chai-like'));
chai.use(require('chai-things'));

describe('Core', function() {
  it('should return all of the core designations', function(done) {
    request('http://localhost:3001/core', function(error, response, body) {
      expect(body).to.equal('[{"core_name":"CHRISTIANITY AND CATHOLIC STUDIES"},{"core_name":"COMMUNICATION AND SPEECH"},{"core_name":"ETHICS"},{"core_name":"FINE ARTS"},{"core_name":"HISTORY"},{"core_name":"LITERATURE"},{"core_name":"MATHEMATICS"},{"core_name":"PHILOSOPHY OF HUMAN NATURE"},{"core_name":"REASONING"},{"core_name":"SCIENTIFIC INQUIRY"},{"core_name":"SOCIAL AND BEHAVIORAL SCIENCES"},{"core_name":"WORLD OR COMPARATIVE RELIGION"},{"core_name":"WRITING"},{"core_name":"GLOBAL STUDIES DESIGNATION"},{"core_name":"SOCIAL JUSTICE DESIGNATION"},{"core_name":"WRITING ENRICHED DESIGNATION"}]');
      done();
    })
  })

  it('should return a page status of 200', function(done) {
      request('http://localhost:3001/core', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
  })

  it('should return in a string format', function(done) {
    request('http://localhost:3001/core', function(error, response, body) {
      assert.typeOf(body, 'string')
      done()
    })
  })

  it('there should be 16 different core designations', function(done) {
    request('http://localhost:3001/core', function(error, response, body) {
      str = body.split(",")
      expect(str).to.have.lengthOf(16)
      done()
    })
  })

  it('there should be a core designation entitled HISTORY', function(done) {
    request('http://localhost:3001/core', function(error, response, body) {
      expect(body).to.match(/(?:"core_name":"HISTORY")/)
      done()
    })
  })
})

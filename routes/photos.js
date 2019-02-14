var pool = require('../pool.js');

module.exports = {

  submitPhotos(req, res) {
    var program = req.body.program;
    var url = req.body.url;
    var height = req.body.height;
    var width = req.body.width;
    var survey_id = req.body.survey_id;
    pool.query("INSERT INTO photos (program, url, survey_id, height, width) VALUES (?,?,?,?,?)",
    [program, url, survey_id, height, width],
    function(error, result) {
      if(error) {
        console.log(error);
        res.send(error);
      } else {
        console.log("Your pictures have been entered into the database");
        res.send(result);
      }
    })
  },

  getProgramPhotos(req, res) {
    var program = req.body.program
    pool.query("SELECT url, height, width FROM photos WHERE program = ?", [program], function(error, result) {
      if (error) {
        console.log(error);
        res.send(error;
      } else {
        console.log(program);
        res.send(result);
      }
    })
  },

  getSurveyPhotos(req, res) {
    var survey_id = req.body.survey_id
    pool.query("SELECT url, height, width FROM photos WHERE survey_id = ?", [survey_id], function(error, result) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(result);
      }
    })
  }
}

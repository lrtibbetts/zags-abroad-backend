var pool = require('../pool.js');

module.exports = {

  submitPhotos(req, res) {
    var program = req.body.program;
    var url = req.body.url;
    var height = req.body.height;
    var width = req.body.width;

    pool.query("INSERT INTO photos (program, url, height, width) VALUES (?,?,?,?)",
    [program, url, height, width],
    function(error, result) {
      if(error) {
        console.log(error);
        res.send(error);
      } else {
        console.log("Your pictures have been entered into the database")
        res.send(result);
      }
    })
  },

  getProgramPhotos(req, res) {
    var program = req.body.program
    pool.query("SELECT url, height, width FROM photos WHERE program = ?", [program], function(error, result) {
      if (error) {
        console.log(error)
        res.send(error)
      } else {
        console.log(program)
        res.send(result)
      }
    })
  }
}

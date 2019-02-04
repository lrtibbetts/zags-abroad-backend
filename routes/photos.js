var pool = require('../pool.js');

module.exports = {

  submitPhotos(req, res) {
    var program = req.body.program
    var photos = req.body.photos

    pool.query("INSERT INTO photos (program, url) VALUES (?,?)",
    [program, photos],
    function(error, result) {
      if(error) {
        console.log(error);
        res.send(error);
      } else {
        console.log("Your pictures are entered into the database")
        res.send(result);
      }
    })
  },

  getProgramPhotos(req, res) {
    var program = req.body.program
    pool.query("SELECT url FROM photos WHERE program = ?", [program], function(error, result) {
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

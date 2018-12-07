var pool = require('../pool.js');

module.exports = {
  //GET ALL CORE DESIGNATIONS
  getCore(req, res) {
    pool.query("SELECT * FROM core_designations", function(err, result) {
      if(err) {
        console.log("Cannot get core designations");
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
};

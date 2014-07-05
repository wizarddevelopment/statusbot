var util = require('util');

module.exports = function(opt){
  var spark = opt.spark;
  var circleNotifier = function (req, res, next) {
    console.log('circle', req.body.payload);
    spark.buildStatus(req.body.payload.outcome);
    res.end();
  };
  return circleNotifier;
};
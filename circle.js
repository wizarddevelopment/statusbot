module.exports = function(opt){
  var spark = opt.spark;
  var circleNotifier = function (req, res, next) {
    console.log('circle', req.body.payload);
    var success = req.body.payload.outcome === 'success';
    var repo = req.body.payload.reponame;
    spark.buildStatus({
      repo: repo,
      success: success
    });
    res.end();
  };
  return circleNotifier;
};
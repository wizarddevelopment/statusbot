module.exports = function(opt){
  var spark = opt.spark;
  var circleNotifier = function (req, res, next) {
    console.log('circle', req.body.payload);
    var success = req.body.payload.outcome === 'success';
    var commit_msg = (req.body.payload.body || "").substr(0,16);
    commit_msg = commit_msg.replace("\n", " ");
    spark.buildStatus({
      repo: req.body.payload.reponame,
      success: success,
      branch: req.body.payload.branch,
      build_num: req.body.payload.build_num,
      commit_msg: commit_msg
    });
    res.end();
  };
  return circleNotifier;
};
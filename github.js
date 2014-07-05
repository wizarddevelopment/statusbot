var util = require('util');

var githubNotifier = function (req, res, next) {
  // console.log('github', req.url, req.body, req.method);
  res.end();
};

module.exports = function(){
  return githubNotifier;
};
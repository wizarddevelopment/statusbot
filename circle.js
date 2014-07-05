var util = require('util');

var circleNotifier = function (req, res, next) {
  console.log('circle', req.url, req.body, req.method);
  res.end();
};

module.exports = function(){
  return circleNotifier;
};
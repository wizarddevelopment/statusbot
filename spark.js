var request = require('request');
var url = require('url');

var SparkStatus = module.exports = function (opt) {
  this.deviceId = opt.deviceId;
  this.accessToken = opt.accessToken;
  // this.queue = [];
};

SparkStatus.prototype.buildStatus = function(status) {
  console.log("Spark status: " + status);
  if (status === "success"){
    this.digitalWrite('D7', 1);
  } else {
    this.digitalWrite('D7', 0);
  }
};

SparkStatus.prototype.send = function(cmd, data, cb) {
  cmd = cmd || "";
  data = data || {};
  data.access_token = this.accessToken;

  var opts = {
    form: data,
    json: true
  };

  var url =  "https://api.spark.io/v1/devices/" + this.deviceId + "/" + cmd;

  return request.post(url, opts, function(error, response, body){
    if (error || response.statusCode != 200 || body.ok === false) {
      var err = error || new Error(body.error);
      return cb && cb(err, body);
    }

    cb && cb(null, body.return_value);
  });
};

/*
  spark.digitalWrite(pin, value, cb);
  pin: eg 'D7', 'A1'
  value: 0 or 1
  cb: function(err, value){}
*/
SparkStatus.prototype.digitalWrite = function(pin, value, cb) {
  var status = value ? 'HIGH' : 'LOW';
  var cmdstr = pin + "," + status;
  this.send('digitalwrite', {params: cmdstr}, cb);
};

var request = require('request');
var url = require('url');

var SparkStatus = module.exports = function (opt) {
  this.deviceId = opt.deviceId;
  this.accessToken = opt.accessToken;
  this.rgb = opt.rgb || ['A2','A1','A0'];
  this.queue = [];
  this.clearStatus();
};

SparkStatus.prototype.clearStatus = function() {
  var rgb = this.rgb;
  this.digitalWrite(this.rgb[0], 1);
  this.digitalWrite(this.rgb[1], 1);
  this.digitalWrite(this.rgb[2], 1);
};


SparkStatus.prototype.buildStatus = function(status) {
  console.log("Spark status: " + status);
  this.clearStatus();
  if (status === "success"){
    this.digitalWrite(this.rgb[1], 0);
    this.digitalWrite(this.rgb[0], 1);
  } else {
    this.digitalWrite(this.rgb[0], 0);
    this.digitalWrite(this.rgb[1], 1);
  }
};

SparkStatus.prototype.send = function(cmd, data, cb) {
  this.queue.push([cmd, data, cb]);
  this.processQueue();
};

SparkStatus.prototype.processQueue = function() {
  if (this.sending) { return; }

  var item = this.queue.shift();
  if (!item) {
    return;
  }

  this.sending = true;
  var cmd = item[0];
  var data = item[1];
  var cb = item[2];

  this._send(cmd, data, function(){
    if (cb) {
      cb.apply(null, arguments);
    }
    this.sending = false;
    this.processQueue();
  }.bind(this));
};

SparkStatus.prototype._send = function(cmd, data, cb) {
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

    if (cb) {
      cb(null, body.return_value);
    }
  });
};

/*
  spark.digitalWrite(pin, value, cb);
  pin: eg 'D7', 'A1'
  value: 0 or 1
  cb: undefined or function(err, value){}
*/
SparkStatus.prototype.digitalWrite = function(pin, value, cb) {
  var status = value ? 'HIGH' : 'LOW';
  var cmdstr = pin + "," + status;
  this.send('digitalwrite', {params: cmdstr}, cb);
};

/*
  spark.analogWrite(pin, value, cb);
  pin: eg 'A1', 'A2'
  value: 0-255
  cb: undefined or function(err, value){}
*/
SparkStatus.prototype.analogWrite = function(pin, value, cb) {
  var cmdstr = pin + "," + value;
  this.send('analogwrite', {params: cmdstr}, cb);
};
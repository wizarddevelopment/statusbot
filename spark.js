var request = require('request');
var url = require('url');

var SparkStatus = module.exports = function (opt) {
  this.deviceId = opt.deviceId;
  this.accessToken = opt.accessToken;
  this.rgb = opt.rgb || ['A2','A1','A0'];
  this.queue = [];
};


SparkStatus.prototype.buildStatus = function(build) {
  if (build.success) {
    this.backlight("00FF00");
    this.write("Repo: " + build.repo + "\nStatus: Success!");
    return;
  }
  this.backlight("FF0000");
  this.write("Repo: " + build.repo + "\nStatus: Failure");
};

SparkStatus.prototype.sendQueued = function(cmd, data, cb) {
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

  this.send(cmd, data, function(){
    if (cb) {
      cb.apply(null, arguments);
    }
    this.sending = false;
    this.processQueue();
  }.bind(this));
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

    if (cb) {
      cb(null, body.return_value);
    }
  });
};


/*
  spark.write(message, cb);
  message: string // one or two lines, 16 chars wide
  cb: undefined or function(err, value){}

  see http://www.adafruit.com/datasheets/HD44780.pdf for special char codes
*/
SparkStatus.prototype.write = function(message, cb) {
  this.send('printLCD', {params: message}, cb);
};

/*
  spark.backlight(hex, cb);
  hex: 'FF00FF' hex color code
  cb: undefined or function(err, value){}
*/
SparkStatus.prototype.backlight = function(hex, cb) {
  this.send('backlight', {params: hex}, cb);
};


SparkStatus.prototype.testBacklight = function(cb) {
  this.send('testLight', {}, cb);
};

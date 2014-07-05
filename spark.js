var SparkStatus = module.exports = function (opts) {
  this.buildStatus("success");
};

SparkStatus.prototype.buildStatus = function(status) {
  console.log("Spark status: " + status);
  if (status === "success"){
    this.green = true;
    this.red = false;
  } else {
    this.green = false;
    this.red = true;
  }
};
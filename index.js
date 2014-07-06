var connect = require('connect');
var morgan  = require('morgan');
var bodyParser = require('body-parser');

var circleNotifier = require('./circle');
var githubNotifier = require('./github');
var SparkStatus = require('./spark')

var app = connect();

if (!process.env.SPARK_DEVICE_ID || !process.env.SPARK_ACCESS_TOKEN) {
  throw new Error("Please make sure SPARK_DEVICE_ID and SPARK_ACCESS_TOKEN environment varibles are set.")
}

var spark = new SparkStatus({
  deviceId: process.env.SPARK_DEVICE_ID,
  accessToken: process.env.SPARK_ACCESS_TOKEN
});

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan());
}

app.use(bodyParser.json());
app.use('/github', githubNotifier({ spark: spark }));
app.use('/circle', circleNotifier({ spark: spark }));

app.listen(process.env.PORT || 3000);

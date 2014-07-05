var connect = require('connect');
var morgan  = require('morgan');
var bodyParser = require('body-parser');

var circleNotifier = require('./circle');
var githubNotifier = require('./github');
var SparkStatus = require('./spark')

var app = connect();
var spark = new SparkStatus();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan());
}

app.use(bodyParser.json());
app.use('/github', githubNotifier({ spark: spark }));
app.use('/circle', circleNotifier({ spark: spark }));

app.listen(process.env.PORT || 3000);

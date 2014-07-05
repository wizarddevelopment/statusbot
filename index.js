var connect = require('connect');
var morgan  = require('morgan');
var bodyParser = require('body-parser');

var circleNotifier = require('./circle');
var githubNotifier = require('./github');

var fakeSpark = {};

var app = connect();

app.use(morgan());
app.use(bodyParser.json());
app.use('/github', githubNotifier({ spark:fakeSpark }));
app.use('/circle', circleNotifier({ spark:fakeSpark }));

app.listen(process.env.PORT || 3000);

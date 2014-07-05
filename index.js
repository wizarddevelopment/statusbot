var connect = require('connect');
var morgan  = require('morgan');
var bodyParser = require('body-parser');

var circleNotifier = require('./circle');
var app = connect();

app.use(morgan());
app.use('/circle', circleNotifier());

app.listen(process.env.PORT || 3000);

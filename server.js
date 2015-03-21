var express = require('express');

var app = express();

var config = require('./server/config/config');

require('./server/config/express')(app, config);

require('./server/config/routes')(app);

app.listen(config.port);

console.log('listening on port ' + config.port);
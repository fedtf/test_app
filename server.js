var express = require('express');

var app = express();

var config = require('./server/config/config');

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config);

require('./server/config/passport')();

require('./server/config/routes')(app);

app.listen(config.port, config.ip);

console.log('listening on port ' + config.port);

console.log(config);
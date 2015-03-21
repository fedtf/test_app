var serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    stylus = require('stylus');


module.exports = function(app, config) {

    function compile(str, path) {
        return stylus(str).set('filename', path);
    }

    app.set('views', config.rootDirname + '/server/views');
    app.set('view engine', 'jade');

    app.use(bodyParser());
    app.use(session({secret: 'polly von'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(stylus.middleware({
        src: config.rootDirname + '/public',
        compile: compile
    }));
    app.use(serveStatic(config.rootDirname + '/public'));

    console.log(config.rootDirname + '/public');
};


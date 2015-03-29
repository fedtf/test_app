var serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    stylus = require('stylus'),
    multer = require('multer');


module.exports = function(app, config) {

    function compile(str, path) {
        return stylus(str).set('filename', path);
    }

    app.set('views', config.rootDirname + '/server/views');
    app.set('view engine', 'jade');
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({secret: 'polly von'}));
    app.use(multer({
        dest: config.uploadDir,
        limits: {fileSize:config.maxUploadSize}
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(stylus.middleware({
        src: config.rootDirname + '/public',
        compile: compile
    }));
    app.use(serveStatic(config.rootDirname + '/public'));

};


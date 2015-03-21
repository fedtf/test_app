
module.exports = function(app, config) {

    app.set('views', config.rootPath + '/server/views');
    app.set('view-engine', 'jade');

};
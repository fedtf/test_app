var auth = require('./auth');
var Table = require('./Table');

module.exports = function(app) {

    app.get('/partials/*', function(req, res) {
        console.log(req.params);
        res.render('../../public/app/partials/' + req.params[0]);
    });

    app.post('/login', auth.authenticate);

    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });

    app.post('/api/users', auth.register);

    app.post('/api/tables', Table.save);

    app.get('/api/tables/:id', Table.get);

    app.get('/api/user-tables/:userId', Table.getUserTables);

    app.put('/api/tables/:id', Table.update);

    app.get('/', function (req, res) {
        res.render('index', {
            bootstrapedUser: req.user
        });
    });
};
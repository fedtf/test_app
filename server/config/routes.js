

module.exports = function(app) {

    app.get('/partials/*', function(req, res) {
        console.log(req.params);
        res.render('../../public/app/partials/' + req.params[0]);
    });

    app.get('/', function (req, res) {
        res.render('index');
    });
};
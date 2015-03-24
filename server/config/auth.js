var passport = require('passport');
var User = require('mongoose').model('User');
var encrypt = require('./encrypt');

exports.authenticate = function(req, res, next) {
        var auth = passport.authenticate('local', function(err, user) {
            if (err) return next(err);
            if (!user) res.send({success:false});
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.send({success:true, user:user});
            })
        });
        auth(req, res, next);
};

exports.register = function(req, res, next) {

    var newUserData = req.body;

    newUserData.salt = encrypt.createSalt();
    newUserData.hash_pwd = encrypt.hashPassword(newUserData.salt, newUserData.password);
    User.create(newUserData, function(err, user) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Этот логин занят');
            }
            res.status(400);
            var stringErr = err.toString().slice(err.toString().indexOf(' ') + 1);
            return res.send({reason:stringErr});
        } else {
            console.log('err');
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send({success:true, user:user});
            })
        }
    });
};
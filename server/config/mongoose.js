var mongoose = require('mongoose'),
    encrypt = require('./encrypt');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function() {
        console.log('db connected');
    });

    var userSchema = mongoose.Schema({
        firstName: {type:String, required:'Пожалуйста, укажите имя'},
        lastName: {type:String, required:'Пожалуйста, укажите фамилию'},
        nickName: {type:String,
            required:'Пожалуйста, введите логин',
            unique: true
        },
        salt: String,
        hash_pwd: {type:String, required:'Пожалуйста, введите пароль'},
        tables: Object
    });

    userSchema.methods = {
        authenticate: function(passwordToMatch) {
            return encrypt.hashPassword(this.salt, passwordToMatch) === this.hash_pwd;
        }
    };

    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function(err, collection){
        if (err) console.log(err);
        if (collection.length === 0) {
            var salt = encrypt.createSalt();
            var hash_pwd = encrypt.hashPassword(salt, 'test');
            User.create({firstName: 'testUser', lastName:'testUser', nickName:'test@mail.ru',
                tables:{some_table:[1,2,3,4]}, salt:salt, hash_pwd:hash_pwd});
        }
//        console.log(collection);
    });

    var tableSchema = mongoose.Schema({
        tableName: {type:String, required: 'Пожалуйста, укажите название таблицы'},
        userId: {type:String, required: true},
        wrightAnswersArray: {type: Array, required: true},
        downArray: {type: Array, required: true},
        correlationArray: {type: Array, required: true},
        rightArray: {type: Array, required: true}
    });

    var Table = mongoose.model('Table', tableSchema);

    Table.find({}).exec(function(err, collection) {
        if (err) console.log(err);
        if (collection.length === 0) {

            User.findOne({}).exec(function (err, user) {
                firstUserId = user._id;
                console.log(firstUserId);
                Table.create({tableName: 'testTable', userId: firstUserId, wrightAnswersArray: [1, 2, 3, 4, 5],
                downArray: [1,2,3,4], correlationArray: [1,2,3,4], rightArray:[1,2,3,4,5]});

            });
        }
//        console.log(collection);
    })
};
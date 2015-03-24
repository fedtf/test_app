var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    rootDirname: rootPath,
    db: 'mongodb://localhost/testApp',
    port: process.env.PORT || 3030
};
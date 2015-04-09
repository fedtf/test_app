var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}


module.exports = {
    rootDirname: rootPath,
    db: connection_string || 'mongodb://localhost/testApp',
    port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    uploadDir: rootPath + '/temp_uploads',
    maxUploadSize: 10 * 1024 * 1024
};
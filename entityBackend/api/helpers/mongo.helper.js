// mongo.helper

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const MongoClient   = require('mongodb').MongoClient;
const Log = require('log4js')
const log = Log.getLogger()
const helper_name = '[Mongo Helper]'

module.exports = {
  connect
}

// Connect to the db
function connect(connectionData){
  return new Promise((resolve, reject) => {
    let intervalObject = setInterval(function(){
      MongoClient.connect(`${connectionData.url}/${connectionData.dbName}`, { useUnifiedTopology: true }, function(error, db) {
        if(error) {
          log.error(`${helper_name}[${connect.name}] -----> Trying connect with MongoDB ...`);
          reject(error);
        }
        else {
          log.debug(`${helper_name}[${connect.name}] -----> Connected correctly to MongoDB`);
          clearInterval(intervalObject);
          resolve(db);
        }
      });
    }, connectionData.interceptorElapse);
  });
}

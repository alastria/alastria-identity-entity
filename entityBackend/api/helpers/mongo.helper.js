// mongo.helper

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const MongoClient   = require('mongodb').MongoClient;
const Log = require('log4js')
const log = Log.getLogger()
const helper_name = '[Config Helper]'

module.exports = {
  connect
}

// Connect to the db
function connect(connectionData){
  return new Promise((resolve, reject) => {
    log.debug(`${helper_name}[${connect.name}] -----> connect: IN`);
    let intervalObject = setInterval(function(){
      MongoClient.connect(`${connectionData.url}/${connectionData.dbName}`, function(error, db) {
        if(error) {
          log.debug(`${helper_name}[${connect.name}] -----> ERROR --> Trying connect with MongoDB ...`);
          reject(error);
        }
        else {
          log.debug(`${helper_name}[${connect.name}] -----> OUT --> Connected correctly to MongoDB`);
          clearInterval(intervalObject);
          resolve(db);
        }
      });
    }, connectionData.interceptorElapse);
  });
}

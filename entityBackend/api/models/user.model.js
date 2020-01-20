'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const Log = require('log4js')
const jwt = require('jsonwebtoken')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()
const log = Log.getLogger()
const mongoHelper = require('../helpers/mongo.helper')
log.level = myConfig.Log.level
const moduleName = '[Entity Model]'

let mongoUrl = myConfig.mongo.url
let mongoDatabase = myConfig.mongo.dbName
let mongoCollection = myConfig.mongo.collection

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  login,
  createUser
}

/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////


function login(params){
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${login.name}] -----> IN...`);
    let username = params.user.value
    let pwd = params.password.value
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).findOne({"$or":[{"name": username}, {"email": username}], "password": pwd})
      .then(found => {
        let jsonObjet = {
          user: username,
          password: pwd
        }
        let token = jwt.sign({data: jsonObjet}, pwd, { expiresIn: 60 * 60})
        log.debug(`${moduleName}[${login.name}] -----> JWT created`);
        connected.close();
        resolve(token)
      })
    })
    .catch(error => {
      log.error(`${moduleName} Error -> ${error}`);
      reject(error);
    });
  });
}

function getuser() {

}

function createUser(params) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${createUser.name}] -----> IN...`)
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let userData = {
        name: params.name,
        surname: params.surname,
        email: params.email,
        address: params.address,
        password: params.password,
        vinculated: params.vinculated
      }
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).insertOne(userData)
      .then(created => {
        log.debug(`${moduleName}[${createUser.name}] -----> User created successfuly`)
        let msg = {
          message: 'Created new user correctly'
        }
        connected.close()
        resolve(msg)
      })
    })
    .catch(error => {
      log.error(`${moduleName}[${createUser.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function updateUser(id){
  return new Promise((resolve, reject) => {

    log.debug(`${nameModule} getPayment: IN`);

    connect()
    .then(db =>{
      db.collection(mongoConfig.collection, function(err, collection){
        var miId = id;
        collection.find({$or: [{'payment_id': miId},{'additional_info.secondary_id': miId}]}).toArray(function(err, data){
          log.debug(`${nameModule} getPayment: Obtaining payment`);
          MongoClient.close();
          resolve(data);
        });
      });
    })
    .catch(err => {
      log.error(`${nameModule} getPayment: Error -> ${err}`);
      MongoClient.close();
      reject(err);
    });
  });
}
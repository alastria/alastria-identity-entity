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
const ObjectId = require('mongodb').ObjectID

let mongoDatabase = myConfig.mongo.dbName
let mongoCollection = myConfig.mongo.collection

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  login,
  createUser,
  updateUser,
  getUser,
  checkAuth
}

/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function isAuth(data) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${isAuth.name}] -----> IN...`);
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      log.debug(`${moduleName}[${isAuth.name}] -----> Checking if user is authenticated`);
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).findOne({"$or":[{"username": data.user}, {"email": data.user}], "password": data.password})
      .then(found => {
        connected.close();
        resolve(found)
      })
      .catch(error => {
        log.error(`${moduleName}[${isAuth.name}] Error -> ${error}`);
        connected.close()
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${moduleName}[${isAuth.name}] Error -> ${error}`);
      reject(error)
    })
  })
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////


function login(params){
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${login.name}] -----> IN...`);
    let username = params.username
    let pwd = params.password
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).findOne({"$or":[{"username": username}, {"email": username}], "password": pwd})
      .then(found => {
        if(found == null) {
          resolve(found)
        }
        let jsonObjet = {
          user: username,
          password: pwd
        }
        let token = jwt.sign({data: jsonObjet}, pwd, { expiresIn: 60 * 60})
        log.debug(`${moduleName}[${login.name}] -----> JWT created`);
        let userObject = {
          userData: {
            id: found._id,
            username: found.username,
            name: found.name,
            surname: found.surname,
            email: found.email,
            address: found.address,
            vinculated: (found.vinculated == null) ? false : found.vinculated,
            did: found.did
          },
          authToken: token
        }
        connected.close();
        resolve(userObject)
      })
      .catch(error => {
        log.error(`${moduleName}[${login.name}] Error -> ${error}`);
        connected.close()
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${moduleName}[${login.name}] Error -> ${error}`);
      reject(error);
    });
  });
}

function createUser(params) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${createUser.name}] -----> IN...`)
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let userData = {
        username: params.username,
        name: params.name,
        surname: params.surname,
        email: params.email,
        address: params.address,
        password: params.password,
        did: params.did,
        vinculated: (params.vinculated == null) ? false : params.vinculated
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
      .catch(error => {
        log.error(`${moduleName}[${createUser.name}] -----> Error: ${error}`)
        connected.close()
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${moduleName}[${createUser.name}] -----> Error: ${error}`)
      reject(error)
    })
  })
}

function updateUser(id, params) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${updateUser.name}] -----> IN...`)
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      getUser(id)
      .then(user => {
        let update = {
          username: ((params.username == null) || (params.username == undefined)) ? user.userData.username : params.username,
          name: ((params.name == null) || (params.name == undefined)) ? user.userData.name : params.name,
          surname: ((params.surname == null) || (params.surname == undefined)) ? user.userData.surname : params.surname,
          email: ((params.email == null) || (params.email == undefined)) ? user.userData.email : params.email,
          address: ((params.address == null) || (params.address == undefined)) ? user.userData.address : params.address,
          did: ((params.did == null) || (params.did == undefined)) ? user.userData.did : params.did,
          vinculated: ((params.vinculated == null) || (params.vinculated == undefined)) ? user.userData.vinculated : params.vinculated,
        }
        if(params.password) {
          update.password = params.password
        }
        let db = connected.db(mongoDatabase)
        db.collection(mongoCollection).updateOne({"_id": new ObjectId(id)},{"$set": update })
        .then(updated => {
          log.debug(`${moduleName}[${updateUser.name}] -----> Updated Records: ${updated.result.nModified}`)
          getUser(id)
          .then(gettedUser => {
            let result = {
              updated: updated.result.nModified,
              user: gettedUser
            }
            connected.close()
            resolve(result)
          })
        })
        .catch(error => {
          log.error(`${moduleName}[${updateUser.name}] -----> Error: ${error}`)
          connected.close()
          reject(error)
        })
      })
    })
    .catch(error => {
      log.error(`${moduleName}[${updateUser.name}] -----> Error: ${error}`)
      reject(error)
    })
  })
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${getUser.name}] -----> IN...`)
    let find = (id.startsWith('did') == true) ? {"did":id} : {"_id": new ObjectId(id)}
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).findOne(find)
      .then(user => {
        if (user == null){
          log.debug(`${moduleName}[${getUser.name}] -----> User not found in the DataBase`)
          resolve(user)
        } else {
          log.debug(`${moduleName}[${getUser.name}] -----> Data obtained`)
          login(user)
          .then(loged => {
            log.debug(`${moduleName}[${getUser.name}] -----> User loged`)
            resolve(loged)
          })
          .catch(error => {
            log.error(`${moduleName}[${getUser.name}] -----> Error: ${error}`)
            connected.close()
            reject(error)
          })
        }
      })
      .catch(error => {
        log.error(`${moduleName}[${getUser.name}] -----> Error: ${error}`)
        connected.close()
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${moduleName}[${getUser.name}] -----> Error: ${error}`)
      reject(error)
    })
  })
}

function checkAuth(token) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${checkAuth.name}] -----> IN...`)
    let decoded = jwt.decode(token)
    log.debug(`${moduleName}[${checkAuth.name}] -----> Decoded token`)
    isAuth(decoded.data)
    .then(auth => {
      log.debug(`${moduleName}[${checkAuth.name}] -----> Sending result`)
      resolve(auth)
    })
    .catch(error => {
      log.error(`${moduleName}[${checkAuth.name}] -----> Error: ${error}`)
      reject(error)
    })
  })
}

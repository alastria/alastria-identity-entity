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
  checkAuth,
  vinculateUser
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
    let username = params.user.value
    let pwd = params.password.value
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
          userdata: {
            id: found._id,
            username: found.username,
            name: found.name,
            surname: found.surname,
            email: found.email,
            address: found.address,
            vinculated: (found.vinculated == null) ? false : found.vinculated
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
      let update = {}
      if(params.password) {
        update = {
          "password": params.password,
        }
      } else if(params.objectIdentity) {
        update = {
          "did": params.objectIdentity.did,
          "proxyAddress": params.objectIdentity.proxyAddress,
          "vinculated": true
        }

      } else {
        update = {
          "username": params.username,
          "name": params.name,
          "surname": params.surname,
          "email": params.email,
          "address": params.address
        }
      }
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).updateOne(
        {"_id": new ObjectId(id)},
        {
          "$set": update
      })
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
    .catch(error => {
      log.error(`${moduleName}[${updateUser.name}] -----> Error: ${error}`)
      reject(error)
    })
  })
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${getUser.name}] -----> IN...`)
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).findOne({"_id": new ObjectId(id)})
      .then(user => {
        log.debug(`${moduleName}[${getUser.name}] -----> Data obtained`)
        let userData = {
          id: user._id,
          username: user.username,
          name: user.name,
          surname: user.surname,
          email: user.email,
          address: user.address,
          did: user.did,
          proxyAddress: user.proxyAddress,
          vinculated: (user.vinculated == null) ? false : user.vinculated
        }
        connected.close()
        resolve(userData)
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

function vinculateUser(objectidentity) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${vinculateUser.name}] -----> IN...`)
    mongoHelper.connect(myConfig.mongo)
    .then(connected => {
      let db = connected.db(mongoDatabase)
      db.collection(mongoCollection).findOne({"_id": new ObjectId(id)})
      .then(user => {
        log.debug(`${moduleName}[${getUser.name}] -----> Data obtained`)
        let userData = {
          id: user._id,
          username: user.username,
          name: user.name,
          surname: user.surname,
          email: user.email,
          address: user.address,
          vinculated: (user.vinculated == null) ? false : user.vinculated
        }
        connected.close()
        resolve(userData)
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
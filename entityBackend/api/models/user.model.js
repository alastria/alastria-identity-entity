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
const moduleName = '[User Model]'
const ObjectId = require('mongodb').ObjectID

const mongoDatabase = myConfig.mongo.dbName
const userCollection = myConfig.mongo.collectionUser
const collectionData = myConfig.mongo.collectionData

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  login,
  createUser,
  updateUser,
  getUser,
  getCredentialIdentityCatalog,
  checkAuth,
  saveTempObject,
  getObjectsFromDB,
  deleteObjectFromDB,
  updateGivedRevoked
}

/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

async function isAuth(data) {
  try {
    log.info(`${moduleName}[${isAuth.name}] -----> IN...`);
    let connected = await mongoHelper.connect(myConfig.mongo)
    log.info(`${moduleName}[${isAuth.name}] -----> Checking if user is authenticated`);
    let db = connected.db(mongoDatabase)
    let found = await db.collection(userCollection).findOne({"$or":[{"username": data.user}, {"email": data.user}], "password": data.password})
    connected.close();
    return found
  }
  catch(error) {
    log.error(`${moduleName}[${isAuth.name}] Error -> ${error}`);
    throw error
  }
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////


async function login(params){
  try {
    log.info(`${moduleName}[${login.name}] -----> IN...`);
    let username = params.username
    let pwd = params.password
    let connected = await mongoHelper.connect(myConfig.mongo)
    let db = connected.db(mongoDatabase)
    let found = await db.collection(userCollection).findOne({"$or":[{"username": username}, {"email": username}], "password": pwd})
    if(found == null) {
      return found
    }
    let jsonObjet = {
      user: username,
      password: pwd
    }
    let token = jwt.sign({data: jsonObjet}, pwd, { expiresIn: 60 * 60})
    log.info(`${moduleName}[${login.name}] -----> JWT created`);
    delete found.password
    let userObject = {
      userData: found,
      authToken: token
    }
    connected.close();
    return userObject
  }
  catch(error) {
    log.error(`${moduleName}[${login.name}] Error -> ${error}`);
    throw error
  }
}

async function createUser(params) {
  try {
    log.info(`${moduleName}[${createUser.name}] -----> IN...`)
    let connected = await mongoHelper.connect(myConfig.mongo)
    let userData = {
      username: params.username,
      name: params.name,
      surname: params.surname,
      email: params.email,
      address: params.address,
      password: params.password,
      did: params.did,
      credentialsGived: [],
      revoked : []
    }
    let db = connected.db(mongoDatabase)
    await db.collection(userCollection).insertOne(userData)
    log.info(`${moduleName}[${createUser.name}] -----> User created successfuly`)
    let msg = {
      message: 'Created new user correctly'
    }
    connected.close()
    return msg

  }
  catch(error) {
    log.error(`${moduleName}[${createUser.name}] -----> Error: ${error}`)
    throw error
  }
}

async function updateUser(params) {
  try {
    log.info(`${moduleName}[${updateUser.name}] -----> IN...`)
    let connected = await mongoHelper.connect(myConfig.mongo)
    let id = (params._id) ? params._id : params.id
    let user = await getUser(id)
    let update = {
      username: ((params.username == null) || (params.username == undefined)) ? user.userData.username : params.username,
      name: ((params.name == null) || (params.name == undefined)) ? user.userData.name : params.name,
      surname: ((params.surname == null) || (params.surname == undefined)) ? user.userData.surname : params.surname,
      email: ((params.email == null) || (params.email == undefined)) ? user.userData.email : params.email,
      address: ((params.address == null) || (params.address == undefined)) ? user.userData.address : params.address,
      did: ((params.did == null) || (params.did == undefined)) ? user.userData.did : params.did,
      vinculated: ((params.vinculated == null) || (params.vinculated == undefined)) ? user.userData.vinculated : params.vinculated
    }
    if(params.password) {
      update.password = params.password
    }
    let db = connected.db(mongoDatabase)
    let updated = await db.collection(userCollection).updateOne({"_id": new ObjectId(id)},{"$set": update })
    log.info(`${moduleName}[${updateUser.name}] -----> Updated Records: ${updated.result.nModified}`)
    let gettedUser = await getUser(id)
    let result = {
      updated: updated.result.nModified,
      user: gettedUser
    }
    connected.close()
    return result

  }
  catch(error) {
    log.error(`${moduleName}[${updateUser.name}] -----> Error: ${error}`)
    throw error
  }
}

async function updateGivedRevoked(params) {
  try {
    log.info(`${moduleName}[${updateGivedRevoked.name}] -----> IN...`)
    let updated
    let connected = await mongoHelper.connect(myConfig.mongo)
    let db = connected.db(mongoDatabase)
    let id = (params._id) ? params._id : params.id
    let fieldToUpdate = (params['credentialsGived'] !== undefined) ? "credentialsGived" : "revoked"
    if(fieldToUpdate === "credentialsGived") {
      updated = await db.collection(userCollection).updateOne(
                                    {"did": id},
                                    {"$push": { "credentialsGived": {"value": params[fieldToUpdate].value, "psmHash": params[fieldToUpdate].psmHash }}})
      log.info(`${moduleName}[${updateGivedRevoked.name}] -----> Updated Gived Credential`)
    } else {
      updated = await db.collection(userCollection).updateOne(
                                    {"did": id},
                                    {"$push": { "revoked": {"value": params[fieldToUpdate].value, "psmHash": params[fieldToUpdate].psmHash }}})
      log.info(`${moduleName}[${updateGivedRevoked.name}] -----> Updated Revoke Credential`)
    }
    return
  }
  catch(error) {
    log.error(`${moduleName}[${updateGivedRevoked.name}] -----> Error: ${error}`)
    throw error
  }
}

async function getUser(id) {
  try {
    log.info(`${moduleName}[${getUser.name}] -----> IN...`)
    let find = (id.startsWith('did') == true) ? {"did":id} : {"_id": new ObjectId(id)}
    let connected = await mongoHelper.connect(myConfig.mongo)
    let db = connected.db(mongoDatabase)
    let user = await db.collection(userCollection).findOne(find)
    if (user == null){
      let error = 'User not found in the DataBase'
      log.error(`${moduleName}[${getUser.name}] -----> ${error}`)
      connected.close()
      throw error
    } else {
      let loged = await login(user)
      log.info(`${moduleName}[${getUser.name}] -----> User data getted`)
      connected.close()
      return loged
    }
  }
  catch(error) {
    log.error(`${moduleName}[${getUser.name}] -----> Error: ${error}`)
    throw error
  }
}

async function getCredentialIdentityCatalog(identityDID) {
  try {
    log.info(`${moduleName}[${getCredentialIdentityCatalog.name}] -----> IN...`)
    let credentialCatalog = []
    let user = await getUser(identityDID)
    if (user == null) {
      throw 'User not found in the DataBase'
    } else {
      delete user.userData._id
      delete user.userData.vinculated
      delete user.userData.did
      let fields = Object.keys(user.userData)
      fields.map(field => {
        let object = {
          credentialName: field,
          credentialType: typeof user.userData[field],
          credentialValue: user.userData[field],
          credentialFormat: typeof user.userData[field]
        }
        credentialCatalog.push(object)
      })
      log.info(`${moduleName}[${getCredentialIdentityCatalog.name}] -----> Obtained credential catalog`)
      return credentialCatalog
    }
  }
  catch(error) {
    log.error(`${moduleName}[${getCredentialIdentityCatalog.name}] -----> Error: ${error}`)
    throw error
  }
}

async function checkAuth(token) {
  try {
    log.info(`${moduleName}[${checkAuth.name}] -----> IN...`)
    let decoded = jwt.decode(token)
    log.info(`${moduleName}[${checkAuth.name}] -----> Decoded token`)
    let auth = await isAuth(decoded.data)
    log.info(`${moduleName}[${checkAuth.name}] -----> Sending result`)
    return auth
  }
  catch(error) {
    log.error(`${moduleName}[${checkAuth.name}] -----> Error: ${error}`)
    throw error
  }
}

async function saveTempObject(object, subjectDID) {
  try {
    log.info(`${moduleName}[${saveTempObject.name}] -----> IN...`)
    let connected = await mongoHelper.connect(myConfig.mongo)
    let objectData = {
      authToken: jwt.sign({data: subjectDID}, myConfig.authKeyToken, { expiresIn: 60 * 60 }),
      object: object
    }
    let db = connected.db(mongoDatabase)
    await db.collection(collectionData).insertOne(objectData)
    log.info(`${moduleName}[${saveTempObject.name}] -----> Object saved successfuly`)
    connected.close()
    return objectData.authToken
  }
  catch(error) {
    log.error(`${moduleName}[${saveTempObject.name}] -----> Error: ${error}`)
    throw error
  }
}

async function getObjectsFromDB(authToken) {
  try {
    log.info(`${moduleName}[${getObjectsFromDB.name}] -----> IN...`)
    let find = {"authToken": authToken}
    let connected = await mongoHelper.connect(myConfig.mongo)
    let db = connected.db(mongoDatabase)
    let objectFound = await db.collection(collectionData).findOne(find)
    if(objectFound == null){
      let error = 'Object not found'
      log.error(`${moduleName}[${getObjectsFromDB.name}] -----> ${error}`)
      connected.close()
      throw error
    }
    connected.close()
    log.info(`${moduleName}[${getObjectsFromDB.name}] -----> Object saved successfuly`)
    return objectFound.object
  }
  catch(error) {
    log.error(`${moduleName}[${getObjectsFromDB.name}] -----> Error: ${error}`)
    throw error
  }
}

async function deleteObjectFromDB(authToken) {
  try {
    log.info(`${moduleName}[${deleteObjectFromDB.name}] -----> IN...`)
    let deleteOne = {"authToken": authToken}
    let connected = await mongoHelper.connect(myConfig.mongo)
    let db = connected.db(mongoDatabase)
    let objectDeleted = await db.collection(collectionData).deleteOne(deleteOne)
    if(objectDeleted == null) {
      let error = 'Object not found'
      log.error(`${moduleName}[${deleteObjectFromDB.name}] -----> ${error}`)
      connected.close()
      throw error
    }
    connected.close()
    log.info(`${moduleName}[${deleteObjectFromDB.name}] -----> Object deleted successfuly`)
    return
  }
  catch(error) {
    log.error(`${moduleName}[${deleteObjectFromDB.name}] -----> Error: ${error}`)
    throw error
  }
}
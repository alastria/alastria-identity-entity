'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const Log = require('log4js')
const configHelper = require('../helpers/config.helper')
const wsHelper = require('../helpers/ws.helper')
const userModel = require('../models/user.model')
const myConfig = configHelper.getConfig()
const io = wsHelper.getWSObject()
const log = Log.getLogger()
log.level = myConfig.Log.level
const controller_name = '[User Controller]'
const Errmsg = {}

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  login,
  addUser,
  updateUser,
  getUser,
  getCredentialIdentityCatalog,
  checkUserAuth,
  getCredentials,
  getObjectFromDB
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function login(req, res) {
  log.info(`${controller_name}[${login.name}] -----> IN ...`)
  let loginData =  {
    username: req.swagger.params.username.value,
    password: req.swagger.params.password.value
  }
  log.debug(`${controller_name}[${login.name}] -----> Sending params: ${JSON.stringify(loginData)}`)
  userModel.login(loginData)
  .then(authenticated => {
    if (authenticated == null) {
      log.error(`${controller_name}[${login.name}] -----> Unauthorized`)
      let msg = {
        message: `Usuario no autorizado`
      }
      res.status(401).send(msg)
    } else {
      log.info(`${controller_name}[${login.name}] -----> User loged correctly`)
      res.status(200).send(authenticated)
    }
  })
  .catch(error => {
    log.error(`${controller_name}[${login.name}] -----> ${error}`)
    Errmsg.message = error
    io.emit('error', {status: 503,
                      message: Errmsg.message})
    res.status(503).send(Errmsg)
  })
}

function addUser(req, res) {
  log.info(`${controller_name}[${addUser.name}] -----> IN ...`)
  let params = req.swagger.params.body.value
  log.debug(`${controller_name}[${addUser.name}] -----> Sending params: ${JSON.stringify(params)}`)
  userModel.createUser(params)
  .then(created => {
    io.emit('getNewUser', 'Usuario creado correctamente')
    res.status(200).send(created)
  })
  .catch(error => {
    log.error(`${controller_name}[${addUser.name}] -----> ${error}`)
    Errmsg.message = error
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

function updateUser(req, res) {
  log.info(`${controller_name}[${updateUser.name}] -----> IN ...`)
  let body = req.swagger.params.body.value
  let id = req.swagger.params.id.value
  let params = body
  params.id = id
  log.debug(`${controller_name}[${updateUser.name}] -----> Sending params: ${JSON.stringify(params)}`)
  userModel.updateUser(params)
  .then(updated => {
    let modifieds = updated.updated
    if(modifieds == 0){
      log.info(`${controller_name}[${updateUser.name}] -----> No records updated`)
      let msg = {
        message: `No se ha actualizado ningun registro`
      }
      res.status(200).send(msg)
    } else {
      log.info(`${controller_name}[${updateUser.name}] -----> Records updated`)
      let response = {
        message: `Exito al actulaizar el usuario`,
        user: updated.user
      }
      res.status(200).send(response)
    }
  })
  .catch(error => {
    log.error(`${controller_name}[${updateUser.name}] -----> ${error}`)
    Errmsg.message = error
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

function getUser(req, res) {
  log.info(`${controller_name}[${getUser.name}] -----> IN ...`)
  let id = req.swagger.params.userID.value
  log.debug(`${controller_name}[${getUser.name}] -----> Sending params: ${JSON.stringify(id)}`)
  userModel.getUser(id)
  .then(userData => {
    log.info(`${controller_name}[${getUser.name}] -----> User found`)
    let userInfo = {
      user: userData
    }
    res.status(200).send(userInfo)
  })
  .catch(error => {
    llog.error(`${controller_name}[${getUser.name}] -----> ${error}`)
    Errmsg.message = error
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

function getCredentialIdentityCatalog(req, res) {
  log.info(`${controller_name}[${getCredentialIdentityCatalog.name}] -----> IN ...`)
  let identityDID = req.swagger.params.identityDID.value
  log.debug(`${controller_name}[${getCredentialIdentityCatalog.name}] -----> Sending params: ${identityDID}`)
  userModel.getCredentialIdentityCatalog(identityDID)
  .then(catalog => {
    log.info(`${controller_name}[${getCredentialIdentityCatalog.name}] -----> Seccessfully obtained credential catalog`)
    res.status(200).send(catalog)
  })
  .catch(error => {
    log.error(`${controller_name}[${getCredentialIdentityCatalog.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getCredentials(req, res) {
  log.info(`${controller_name}[${getCredentials.name}] -----> IN ...`)
  let identityDID = req.swagger.params.identityDID.value
  log.debug(`${controller_name}[${getCredentials.name}] -----> Sending params: ${identityDID}`)
  userModel.getCredentials(identityDID)
  .then(object => {
    log.info(`${controller_name}[${getCredentials.name}] -----> Getted object from DB`)
    res.status(200).send(object)
  })
  .catch(error => {
    Errmsg.message = error
    log.error(`${controller_name}[${getCredentials.name}] -----> ${Errmsg.message}`)
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

function getObjectFromDB(req, res) {
  log.info(`${controller_name}[${getObjectFromDB.name}] -----> IN ...`)
  let authToken = req.swagger.params.authToken.value
  log.debug(`${controller_name}[${getObjectFromDB.name}] -----> Sending params: ${authToken}`)
  userModel.getObjectsFromDB(authToken)
  .then(object => {
    log.info(`${controller_name}[${getObjectFromDB.name}] -----> Getted object from DB`)
    userModel.deleteObjectFromDB(authToken)
    res.status(200).send(object)
  })
  .catch(error => {
    Errmsg.message = error
    log.error(`${controller_name}[${getObjectFromDB.name}] -----> ${Errmsg.message}`)
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

function checkUserAuth(req, res) {
  log.info(`${controller_name}[${checkUserAuth.name}] -----> IN ...`)
  let token = req.swagger.params.authToken.value
  log.debug(`${controller_name}[${checkUserAuth.name}] -----> Sending params: ${JSON.stringify(token)}`)
  userModel.checkAuth(token)
  .then(isAuth => {
    if(isAuth == null) {
      log.info(`${controller_name}[${checkUserAuth.name}] -----> User not authenticated`)
      res.status(200).send({ status: false })
    } else {
      log.info(`${controller_name}[${checkUserAuth.name}] -----> User Authenticated`)
      res.status(200).send({ status: true })
    }
  })
  .catch(error => {
    log.error(`${controller_name}[${checkUserAuth.name}] -----> ${error}`)
    Errmsg.message = error
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

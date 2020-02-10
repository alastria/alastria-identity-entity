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

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  login,
  addUser,
  updateUser,
  getUser,
  checkUserAuth
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function login(req, res) {
  try {
    log.debug(`${controller_name}[${login.name}] -----> IN ...`)
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
        log.debug(`${controller_name}[${login.name}] -----> User loged correctly`)
        res.status(200).send(authenticated)
      }
    })
    .catch(error => {
      log.error(`${controller_name}[${login.name}] -----> ${error}`)
      let msg = {
        message: `${error}`
      }
      io.emit('error', {status: 503,
                        message: msg.message})
      res.status(401).send(msg)
    })
  } 
  catch(error) {
    log.error(`${controller_name}[${login.name}] -----> ${error}`)
    let msg = {
      message: `${error}`
    }
    io.emit('error', {status: 503,
                      message: msg.message})
    res.status(503).send(msg)
  }
}

function addUser(req, res) {
  try {
    log.debug(`${controller_name}[${addUser.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${addUser.name}] -----> Sending params: ${JSON.stringify(params)}`)
    userModel.createUser(params)
    .then(created => {
      io.emit('getNewUser', 'Usuario creado correctamente')
      res.status(200).send(created)
    })
    .catch(error => {
      log.error(`${controller_name}[${addUser.name}] -----> Error: ${error}`)
      let msg = {
        message: `${error}`
      }
      io.emit('error', {status: 400,
                        message: msg.message})
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${addUser.name}] -----> Error: ${error}`)
    let msg = {
      message: `${error}`
    }
    io.emit('error', {status: 503,
                      message: msg.message})
    res.status(503).send(msg)
  }
}

function updateUser(req, res) {
  try {
    log.debug(`${controller_name}[${updateUser.name}] -----> IN ...`)
    let id = req.swagger.params.id.value
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${updateUser.name}] -----> Sending params: ${JSON.stringify(params)}`)
    userModel.updateUser(id, params)
    .then(updated => {
      let modifieds = updated.updated
      if(modifieds == 0){
        log.debug(`${controller_name}[${updateUser.name}] -----> No records updated`)
        let msg = {
          message: `No se ha actualizado ningun registro`
        }
        res.status(200).send(msg)
      } else {
        log.debug(`${controller_name}[${updateUser.name}] -----> Records updated`)
        let response = {
          message: `Exito al actulaizar el usuario`,
          user: updated.user
        }
        res.status(200).send(response)
      }
    })
  }
  catch(error) {
    log.error(`${controller_name}[${updateUser.name}] -----> Error: ${error}`)
    let msg = {
      message: `${error}`
    }
    res.status(503).send(msg)
  }
}

function getUser(req, res) {
  try {
    log.debug(`${controller_name}[${getUser.name}] -----> IN ...`)
    let id = req.swagger.params.userID.value
    log.debug(`${controller_name}[${getUser.name}] -----> Sending params: ${JSON.stringify(id)}`)
    userModel.getUser(id)
    .then(userData => {
      if (userData == null) {
        log.debug(`${controller_name}[${getUser.name}] -----> User not found`)
        let msg = {
          message: `User not found`
        }
        res.status(404).send(msg)
      } else {
        log.debug(`${controller_name}[${getUser.name}] -----> User found`)
        let userInfo = {
          user: userData
        }
        res.status(200).send(userInfo)
      }
    })
    .catch(error => {
      log.debug(`${controller_name}[${getUser.name}] -----> Error: ${error}`)
      let msg = {
        message: `${error}`
      }
      res.status(404).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${getUser.name}] -----> Error: ${error}`)
    let msg = {
      message: `${error}`
    }
    res.status(503).send(msg)
  }
}

function checkUserAuth(req, res) {
  try {
    log.debug(`${controller_name}[${checkUserAuth.name}] -----> IN ...`)
    let token = req.swagger.params.authToken.value
    log.debug(`${controller_name}[${checkUserAuth.name}] -----> Sending params: ${JSON.stringify(token)}`)
    userModel.checkAuth(token)
    .then(isAuth => {
      if(isAuth == null) {
        log.debug(`${controller_name}[${checkUserAuth.name}] -----> User not authenticated`)
        res.status(200).send({ status: false })
      } else {
        log.debug(`${controller_name}[${checkUserAuth.name}] -----> User Authenticated`)
        res.status(200).send({ status: true })
      }
    })
    .catch(error => {
      log.error(`${controller_name}[${checkUserAuth.name}] -----> Error: ${error}`)
      let msg = {
        message: `${error}`
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${checkUserAuth.name}] -----> Error: ${error}`)
    let msg = {
      message: `${error}`
    }
    res.status(503).send(msg)
  }
}

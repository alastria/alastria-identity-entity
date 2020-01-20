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
  addUser
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function login(req, res) {
  try {
    log.debug(`${controller_name}[${login.name}] -----> IN ...`)
    console.log(req.swagger.params)
    let params = req.swagger.params
    log.debug(`${controller_name}[${login.name}] -----> Sending params: ${JSON.stringify(params)}`)
    userModel.login(params)
    .then(authenticated => {
      console.log(authenticated)
      let result = {
        token: authenticated
      }
      io.emit('login', authenticated)
      res.status(200).send(result)
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
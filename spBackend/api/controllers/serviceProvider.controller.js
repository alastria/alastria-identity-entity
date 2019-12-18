'use strict';

const Log = require('log4js')
const serviceProvidermodel = require('../models/serviceProvider.model')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()

const log = Log.getLogger()
log.level = myConfig.Log.level
const controller_name = '[serviceProvider Controller]'

module.exports = {
  createAlastriaID,
  addSubjectCredential,
  getCurrentPublicKey
}

function createAlastriaID(req, res) {
  try {
    log.info(`${controller_name}[${createAlastriaID.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.info(`${controller_name}[${createAlastriaID.name}] -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.createAlastriaID(params)
    .then(alastriaID => {
      if (alastriaID) {
        log.info(`${controller_name}[${createAlastriaID.name}] -----> Successfully created new AlastriaId`)
        res.status(200).send(alastriaID)
      }
      else {
        let msg = {
          message: 'Error creating new AlastriaID'
        }
        res.status(404).send(msg)
      }
    })
    .catch(error => {
      let msg = {
        message: `${error}`
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.info(`${controller_name}[${createAlastriaID.name}] -----> ${error}`)
    let msg = {
      message: `${error}`
    }
    res.status(503).send(msg)
   }
}

function addSubjectCredential(req, res) {
  try {
    log.info(`${controller_name}[${addSubjectCredential.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.info(`${controller_name}[${addSubjectCredential.name}] -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.addSubjectCredential(params)
    .then(addedCredential => {
      log.info(`${controller_name}[${addSubjectCredential.name}] -----> Successfully added credential: ${JSON.stringify(addedCredential)}`)
      res.status(200).send(addedCredential)
    })
    .catch(error => {
      log.info(`${controller_name}[${addSubjectCredential.name}] -----> ${error}`)
      let msg = {
        message: 'Error: Transaction has been reverted by the EVM'
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.info(`${controller_name}[${addSubjectCredential.name}] -----> ${error}`)
    let msg = {
      message: 'Insternal Server Erorr'
    }
    res.status(503).send(msg)
   }
}

function getCurrentPublicKey(req, res) {
  try {
    log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> IN ...`)
    let alastriaId = req.swagger.params.alastriaId.value
    log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> Sending params: ${JSON.stringify(alastriaId)}`)
    serviceProvidermodel.getCurrentPublicKey(alastriaId)
    .then(credential => {
      if (credential) {
        log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> Successfully obtained Public Key: ${credential}`)
        let result = {
          publicKey: credential.substr(31)
        }
        res.status(200).send(result)
      }
      else {
        let msg = {
          message: 'Error getting credential'
        }
        res.status(404).send(msg)
      }
    })
    .catch(error => {
      let msg = {
        message: `Insternal Server Error: ${error}`
      }
      res.status(503).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${getCurrentPublicKey.name}] -----> ${error}`)
   }
}
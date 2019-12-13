'use strict';

const Log = require('log')
const serviceProvidermodel = require('../models/serviceProvider.model')

const log = new Log('debug')
const controller_name = '[serviceProvider Controller]'

module.exports = {
  createAlastriaID,
  addSubjectCredential,
  getCurrentPublicKey
}

function createAlastriaID(req, res) {
  try {
    log.debug(`${controller_name}[${createAlastriaID.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${createAlastriaID.name}] -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.createAlastriaID(params)
    .then(alastriaID => {
      if (alastriaID) {
        log.debug(`${controller_name}[${createAlastriaID.name}] -----> Successfully created new AlastriaId`)
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
        message: error
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.debug(`${controller_name}[${createAlastriaID.name}] -----> ${error}`)
    let msg = {
      message: error
    }
    res.status(503).send(msg)
   }
}

function addSubjectCredential(req, res) {
  try {
    log.debug(`${controller_name}[${addSubjectCredential.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${addSubjectCredential.name}] -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.addSubjectCredential(params)
    .then(credential => {
      if (credential) {
        log.debug(`${controller_name}[${addSubjectCredential.name}] -----> Successfully created added credential: ${JSON.stringify(credential)}`)
        res.status(200).send(credential)
      }
      else {
        let msg = {
          message: 'Error adding credential'
        }
        res.status(404).send(msg)
      }
    })
    .catch(error => {
      log.debug(`${controller_name}[${addSubjectCredential.name}] -----> ${error}`)
      let msg = {
        message: JSON.stringify(error)
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.debug(`${controller_name}[${addSubjectCredential.name}] -----> ${error}`)
    let msg = {
      message: JSON.stringify(error)
    }
    res.status(503).send(msg)
   }
}

function getCurrentPublicKey(req, res) {
  try {
    log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> IN ...`)
    let alastriaId = req.swagger.params.alastriaId.value
    log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> Sending params: ${JSON.stringify(alastriaId)}`)
    serviceProvidermodel.getCurrentPublicKey(alastriaId)
    .then(credential => {
      if (credential) {
        log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> Successfully obtained Public Key: ${credential}`)
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
      res.status(503).send(error)
    })
  }
  catch(error) {
    log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> ${error}`)
   }
}
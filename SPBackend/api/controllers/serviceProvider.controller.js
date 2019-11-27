'use strict';

const Log = require('log')
const serviceProvidermodel = require('../models/serviceProvider.model')

const log = new Log('debug')
const controller_name = '[serviceProvider Controller]'

module.exports = {
  newAlastriaID,
  newSubjectCredential,
  currentPublicKey
}

function newAlastriaID(req, res) {
  try {
    log.debug(`${controller_name}${newAlastriaID.name} -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}${newAlastriaID.name} -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.createAlastriaID(params)
    .then(alastriaID => {
      if (alastriaID) {
        log.debug(`${controller_name}${newAlastriaID.name} -----> Successfully created new AlastriaId`)
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
      res.status(503).send(error)
    })
  }
  catch(error) {
    log.debug(`${controller_name}${newAlastriaID.name} -----> ${error}`)
   }
}

function newSubjectCredential(req, res) {
  try {
    log.debug(`${controller_name}${newSubjectCredential.name} -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}${newSubjectCredential.name} -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.addSubjectCredential(params)
    .then(credential => {
      if (credential) {
        log.debug(`${controller_name}${newSubjectCredential.name} -----> Successfully created added credential`)
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
      res.status(503).send(error)
    })
  }
  catch(error) {
    log.debug(`${controller_name}${newSubjectCredential.name} -----> ${error}`)
   }
}

function currentPublicKey(req, res) {
  try {
    log.debug(`${controller_name}${currentPublicKey.name} -----> IN ...`)
    console.log(req.swagger.params.alastriaId.value)
    let alastriaId = req.swagger.params.alastriaId.value
    log.debug(`${controller_name}${currentPublicKey.name} -----> Sending params: ${JSON.stringify(alastriaId)}`)
    serviceProvidermodel.getCurrentPublicKey(alastriaId)
    .then(credential => {
      if (credential) {
        log.debug(`${controller_name}${currentPublicKey.name} -----> Successfully obtained ublic Key`)
        res.status(200).send(credential)
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
    log.debug(`${controller_name}${currentPublicKey.name} -----> ${error}`)
   }
}
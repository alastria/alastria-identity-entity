'use strict';

const Log = require('log')
const serviceProvidermodel = require('../models/serviceProvider.model')

const log = new Log('debug')
const controller_name = '[serviceProvider Controller]'

module.exports = {
  createAlastriaID,
  addIssuerCredential,
  getCurrentPublicKey,
  getpresentationStatus,
  updateReceiverPresentationStatus
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

function addIssuerCredential(req, res) {
  try {
    log.debug(`${controller_name}[${addIssuerCredential.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${addIssuerCredential.name}] -----> Sending params: ${JSON.stringify(params)}`)
    serviceProvidermodel.addIssuerCredential(params)
    .then(addedCredential => {
      log.debug(`${controller_name}[${addIssuerCredential.name}] -----> Successfully added credential: ${JSON.stringify(addedCredential)}`)
      res.status(200).send(addedCredential)
    })
    .catch(error => {
      log.debug(`${controller_name}[${addIssuerCredential.name}] -----> ${error}`)
      let msg = {
        message: 'Error: Transaction has been reverted by the EVM'
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.debug(`${controller_name}[${addIssuerCredential.name}] -----> ${error}`)
    let msg = {
      message: 'Insternal Server Erorr'
    }
    res.status(503).send(msg)
   }
}

function getCurrentPublicKey(req, res) {
  try {
    log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> IN ...`)
    let alastriaId = req.swagger.params.alastriaDID.value
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

function getpresentationStatus(req, res){
  try {
    log.debug(`${controller_name}[${getpresentationStatus.name}] -----> IN ...`);
    let presentationHash = req.swagger.params.presentationHash.value;
    log.debug(`${controller_name}[${getpresentationStatus.name}] -----> Sending params: ${JSON.stringify(presentationHash)}`)
    let issuer = req.swagger.params.serviceProvider.value;
    let subject = req.swagger.params.subject.value;
    serviceProvidermodel.getpresentationStatus(presentationHash,issuer,subject)
      .then(presentationStatus => { 
        if (presentationStatus != null){
          log.debug(`${controller_name}[${getpresentationStatus.name}] -----> Successfully obtained presentation status: ${presentationStatus}`);
          res.status(200).send(presentationStatus);
        }
        else {
          let msg = {
            message: 'Error getting presentation status'
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
  } catch (error) {
    log.error(`${controller_name}[${getpresentationStatus.name}] -----> ${error}`)
  }
}

function updateReceiverPresentationStatus(req, res){
  try {
    log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> IN ...`);
    let presentationHash = req.swagger.params.presentationHash.value;
    log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Sending params: ${JSON.stringify(presentationHash)}`)
    let newStatus = req.swagger.params.body.value;    
    serviceProvidermodel.updateReceiverPresentationStatus(presentationHash,newStatus)
      .then(() => { 
          log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Successfully updated status presentation`);
          res.status(200).send();
      })
      .catch(error => {
        let msg = {
          message: `Insternal Server Error: ${error}`
        }
        res.status(503).send(msg)
      })         
  } catch (error) {
    log.error(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> ${error}`)
  }
}
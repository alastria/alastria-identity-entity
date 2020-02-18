'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const Log = require('log4js')
const entityService = require('../services/entity.service')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()
const wsHelper = require('../helpers/ws.helper')
const io = wsHelper.getWSObject()
const log = Log.getLogger()
log.level = myConfig.Log.level
const controller_name = '[Entity Controller]'

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  createAlastriaID,
  addIssuerCredential,
  getCurrentPublicKey,
  getPresentationStatus,
  updateReceiverPresentationStatus,
  getCredentialStatus,
  recivePresentationData,
  verifyAlastriaSession
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function createAlastriaID(req, res) {
  try {
    log.debug(`${controller_name}[${createAlastriaID.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${createAlastriaID.name}] -----> Sending params: ${JSON.stringify(params)}`)
    entityService.createAlastriaID(params)
    .then(alastriaId => {
      if (alastriaId) {
        log.debug(`${controller_name}[${createAlastriaID.name}] -----> Successfully created new AlastriaId`)
        io.emit('createIdentity', alastriaId)
        res.status(200).send(alastriaId)
      }
      else {
        let msg = {
          message: 'Error creating new AlastriaID'
        }
        io.emit('error', {status: 404,
                          message: msg.message})
        res.status(404).send(msg)
      }
    })
    .catch(error => {
      let msg = {
        message: `${error}`
      }
      io.emit('error', {status: 400,
                        message: msg.message})
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${createAlastriaID.name}] -----> ${error}`)
    let msg = {
      message: `${error}`
    }
    io.emit('error', {status: 503,
                      message: msg.message})
    res.status(503).send(msg)
   }
}

function addIssuerCredential(req, res) {
  try {
    log.debug(`${controller_name}[${addIssuerCredential.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${addIssuerCredential.name}] -----> Sending params: ${JSON.stringify(params)}`)
    entityService.addIssuerCredential(params)
    .then(addSubjectPres => {
      log.debug(`${controller_name}[${addIssuerCredential.name}] -----> Successfully added credential: ${JSON.stringify(addSubjectPres)}`)
      res.status(200).send(addSubjectPres)
    })
    .catch(error => {
      log.error(`${controller_name}[${addIssuerCredential.name}] -----> ${error}`)
      let msg = {
        message: 'Error: Transaction has been reverted by the EVM'
      }
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${addIssuerCredential.name}] -----> ${error}`)
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
    entityService.getCurrentPublicKey(alastriaId)
    .then(publickey => {
      if (publickey[0].length > 0) {
        log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> Successfully obtained Public Key`)
        let result = {
          publicKey: publickey[0]
        }
        res.status(200).send(result)
      }
      else {
        log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> Error getting publicKey`)
        let msg = {
          message: 'Error getting Public Key'
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

function getPresentationStatus(req, res){
  try {
    log.debug(`${controller_name}[${getPresentationStatus.name}] -----> IN ...`);
    let presentationHash = req.swagger.params.presentationHash.value;
    log.debug(`${controller_name}[${getPresentationStatus.name}] -----> Sending params: ${JSON.stringify(presentationHash)}`)
    let issuer = req.swagger.params.serviceProvider.value;
    let subject = req.swagger.params.subject.value;
    entityService.getPresentationStatus(presentationHash,issuer,subject)
    .then(presentationStatus => { 
      if (presentationStatus != null){
        log.debug(`${controller_name}[${getPresentationStatus.name}] -----> Successfully obtained presentation status: ${presentationStatus}`);
        res.status(200).send(presentationStatus);
      }
      else {
        log.error(`${controller_name}[${getPresentationStatus.name}] -----> Error: Error getting presentation status`);
        let msg = {
          message: 'Error getting presentation status'
        }
        res.status(404).send(msg)
      }        
    })
    .catch(error => {
      log.error(`${controller_name}[${getPresentationStatus.name}] -----> ${error}`);
      let msg = {
        message: `${error}`
      }
      res.status(400).send(msg)
    })         
  } catch (error) {
    log.error(`${controller_name}[${getPresentationStatus.name}] -----> ${error}`)
    let msg = {
      message: `Insternal Server Error: ${error}`
    }
    res.status(503).send(msg)
  }
}

function updateReceiverPresentationStatus(req, res){
  try {
    log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> IN ...`);
    let presentationHash = req.swagger.params.presentationHash.value;
    log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Sending params: ${JSON.stringify(presentationHash)}`)
    let newStatus = req.swagger.params.body.value;    
    entityService.updateReceiverPresentationStatus(presentationHash,newStatus)
    .then(() => { 
      log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Successfully updated status presentation`);
      res.status(200).send();
    })
    .catch(error => {
      log.error(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> ${error}`);
      let msg = {
        message: `${error}`
      }
      res.status(404).send(msg)
    })         
  } catch (error) {
    log.error(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> ${error}`)
    let msg = {
      message: `${error}`
    }
    res.status(503).send(msg)
  }
}

function getCredentialStatus(req, res){
  try {
    log.debug(`${controller_name}[${getCredentialStatus.name}] -----> IN ...`);
    let credentialHash = req.swagger.params.credentialHash.value;
    let issuer = req.swagger.params.issuer.value;
    let subject = req.swagger.params.subject.value;
    log.debug(`${controller_name}[${getCredentialStatus.name}] -----> Sending params: ${JSON.stringify(credentialHash, issuer, subject)}`)
    entityService.getCredentialStatus(credentialHash, issuer, subject)
    .then(credentialStatus => { 
      log.debug(`${controller_name}[${getCredentialStatus.name}] -----> Successfully saved the credential`)
      io.emit('fillYourProfile', {status: 200,
                                  message: 'Guardada correctamente las credenciales.'})
      res.status(200).send(credentialStatus);
      
    })
    .catch(error => {
      log.error(`${controller_name}[${getCredentialStatus.name}] -----> ${JSON.stringify(error.message)}`)
      let msg = {
        message: 'Error getting presentation status'
      }
      io.emit('error', {status: 404,
                        message: 'No se ha guardado correctamente la credencial. Vuelva a intentarlo.'})
      res.status(404).send(msg)
    })         
  } catch (error) {
    log.error(`${controller_name}[${getCredentialStatus.name}] -----> ${error}`)
    let msg = {
      message: `Insternal Server Error: ${error}`
    }
    res.status(503).send(msg)
  }
}

function recivePresentationData(req, res) {
  try {
    log.debug(`${controller_name}[${recivePresentationData.name}] -----> IN ...`);
    let presentationSigned = req.swagger.params.presentation.value
    log.debug(`${controller_name}[${recivePresentationData.name}] -----> Sending params: ${JSON.stringify(req.swagger.params.presentation.value)}`)
    entityService.getPresentationData(presentationSigned)
    .then(subjectData => {
      log.debug(`${controller_name}[${recivePresentationData.name}] -----> Successfully obtained presentation data`);
      io.emit('getPresentationData', {status: 200,
                                      message: subjectData})
      res.status(200).send(subjectData)
    })
    .catch(error => {
      let message = (error == false) ? 'Clave pública no válida' : 'Error obteniendo los datos de la presentación'
      let msg = {
        message: `${error}`
      }
      log.error(`${controller_name}[${recivePresentationData.name}] -----> Error: ${message}`);
      io.emit('error', {status: 400,
                        message: msg.message})
      res.status(400).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${recivePresentationData.name}] -----> Error: ${error}`);
    let msg = {
      message: 'Internal server error'
    }
    io.emit('error', {status: 503,
                      message: msg.message})
    res.status(503).send(msg)
  }
}

function verifyAlastriaSession(req, res) {
  try {
    log.debug(`${controller_name}[${verifyAlastriaSession.name}] -----> IN ...`)
    let alastriaSession = req.swagger.params.alastriaSession.value
    log.debug(`${controller_name}[${verifyAlastriaSession.name}] -----> Sending params: ${JSON.stringify(alastriaSession)}`)
    entityService.verifyAlastriaSession(alastriaSession)
    .then(verified => {
      log.debug(`${controller_name}[${verifyAlastriaSession.name}] -----> Alastria Sesion verified successfuly`)
      io.emit('session', verified)
      res.status(200).send(verified)
    })
    .catch(error => {
      log.error(`${controller_name}[${verifyAlastriaSession.name}] -----> Error: ${error}`)
    let msg = {
      message: `${error}`
    }
    io.emit('error', {status: 401,
                      message: msg.message})
    res.status(401).send(msg)
    })
  }
  catch(error) {
    log.error(`${controller_name}[${verifyAlastriaSession.name}] -----> Error: ${error}`)
    let msg = {
      message: `${error}`
    }
    res.status(503).send(msg)
  }
}

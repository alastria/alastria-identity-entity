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
const Errmsg = {}

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  createAlastriaToken,
  verifyAlastriaSession,
  createAlastriaID,
  getCurrentPublicKey,
  getCurrentPublicKeyList,
  addEntity,
  getEntities,
  getEntity,
  addIssuer,
  isIssuer,
  createCredential,
  getPresentationStatus,
  updateReceiverPresentationStatus,
  getCredentialStatus,
  recivePresentationData
  // addIssuerCredential,
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function createAlastriaToken(req, res) {
  log.info(`${controller_name}[${createAlastriaToken.name}] -----> IN ...`)
  log.debug(`${controller_name}[${verifyAlastriaSession.name}] -----> Calleing Entity Service`)
  entityService.createAlastriaToken()
  .then(AT => {
    log.info(`${controller_name}[${createAlastriaToken.name}] -----> Created Alastria Token`)
    res.status(200).send(AT)
  })
  .catch(error => {
    log.error(`${controller_name}[${createAlastriaToken.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(400).send(Errmsg)
  })
}

function verifyAlastriaSession(req, res) {
  log.info(`${controller_name}[${verifyAlastriaSession.name}] -----> IN ...`)
  let alastriaSession = req.swagger.params.alastriaSession.value
  log.debug(`${controller_name}[${verifyAlastriaSession.name}] -----> Sending params: ${JSON.stringify(alastriaSession)}`)
  entityService.verifyAlastriaSession(alastriaSession)
  .then(verified => {
    log.info(`${controller_name}[${verifyAlastriaSession.name}] -----> Alastria Sesion verified successfuly`)
    io.emit('session', verified)
    res.status(200).send(verified)
  })
  .catch(error => {
    log.error(`${controller_name}[${verifyAlastriaSession.name}] -----> ${error}`)
    Errmsg.message = JSON.stringify(error)
  io.emit('error', {status: 401,
                    message: Errmsg.message})
  res.status(401).send(Errmsg)
  })
}

function createAlastriaID(req, res) {
  log.info(`${controller_name}[${createAlastriaID.name}] -----> IN ...`)
  let params = req.swagger.params.AIC.value
  log.debug(`${controller_name}[${createAlastriaID.name}] -----> Sending params: ${JSON.stringify(params)}`)
  entityService.createAlastriaID(params)
  .then(alastriaId => {
    if (alastriaId) {
      log.info(`${controller_name}[${createAlastriaID.name}] -----> Successfully created new AlastriaId`)
      io.emit('createIdentity', alastriaId)
      res.status(200).send(alastriaId)
    }
    else {
      log.error(`${controller_name}[${createAlastriaID.name}] -----> ${error}`)
      Errmsg.message = error
      io.emit('error', {status: 404,
                        message: Errmsg.message})
      res.status(404).send(Errmsg)
    }
  })
  .catch(error => {
    log.error(`${controller_name}[${createAlastriaID.name}] -----> ${error.message}`)
    Errmsg.message = error.message
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}

function getCurrentPublicKey(req, res) {
  log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> IN ...`)
  let did = req.swagger.params.alastriaDID.value
  log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> Sending params: ${JSON.stringify(did)}`)
  entityService.getCurrentPublicKey(did)
  .then(publickey => {
    if (publickey[0].length > 0) {
      log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> Successfully obtained Public Key`)
      let result = {
        publicKey: publickey[0]
      }
      res.status(200).send(result)
    }
    else {
      Errmsg.message = "Error getting publicKey"
      log.error(`${controller_name}[${getCurrentPublicKey.name}] -----> Error: ${Errmsg.message}`)
      res.status(404).send(Errmsg)
    }
  })
  .catch(error => {
    log.error(`${controller_name}[${getCurrentPublicKey.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(400).send(Errmsg)
  })
}

function getCurrentPublicKeyList(req, res) {
  log.info(`${controller_name}[${getCurrentPublicKeyList.name}] -----> IN ...`)
  let did = req.swagger.params.alastriaDID.value
  log.debug(`${controller_name}[${getCurrentPublicKeyList.name}] -----> Sending params: ${JSON.stringify(did)}`)
  entityService.getCurrentPublicKeyList(did)
  .then(list => {
    log.info(`${controller_name}[${getCurrentPublicKeyList.name}] -----> Successfully obtained Public Key List`)
    res.status(200).send(list)
  })
  .catch(error => {
    log.error(`${controller_name}[${getCurrentPublicKeyList.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(400).send(Errmsg)
  })
}

function addEntity(req, res) {
  log.info(`${controller_name}[${addEntity.name}] -----> IN ...`)
  let entityData = req.swagger.params.entityData.value
  log.debug(`${controller_name}[${addEntity.name}] -----> Sending params: ${JSON.stringify(entityData)}`)
  entityService.addEntity(entityData)
  .then(data => {
    log.info(`${controller_name}[${addEntity.name}] -----> Successfully added new Entity`)
    res.status(200).send(data)
  })
  .catch(error => {
    log.error(`${controller_name}[${addEntity.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getEntities(req, res) {
  log.info(`${controller_name}[${getEntities.name}] -----> IN ...`)
  log.debug(`${controller_name}[${getEntities.name}] -----> Calling Entity Service`)
  entityService.getEntities()
  .then(entities => {
    log.info(`${controller_name}[${getEntities.name}] -----> Successfully getted all Entities`)
    console.log(entities)
    res.status(200).send(entities)
  })
  .catch(error => {
    log.error(`${controller_name}[${getEntities.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getEntity(req, res) {
  log.info(`${controller_name}[${getEntity.name}] -----> IN ...`)
  let entityDID = req.swagger.params.entityDID.value
  log.debug(`${controller_name}[${getEntity.name}] -----> Sending params: ${entityDID}`)
  entityService.getEntity(entityDID)
  .then(entity => {
    log.info(`${controller_name}[${getEntity.name}] -----> Successfully getted Entity`)
    res.status(200).send(entity)
  })
  .catch(error => {
    log.error(`${controller_name}[${getEntity.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function addIssuer(req, res) {
  log.info(`${controller_name}[${addIssuer.name}] -----> IN ...`)
  let issuerData = req.swagger.params.issuerData.value
  log.debug(`${controller_name}[${addIssuer.name}] -----> Sending params: ${issuerData}`)
  entityService.addIssuer(issuerData)
  .then(issuer => {
    log.info(`${controller_name}[${addIssuer.name}] -----> Successfully added new Issuer`)
    let status = issuer
    res.status(200).send(status)

  })
  .catch(error => {
    log.error(`${controller_name}[${addIssuer.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function isIssuer(req, res) {
  try {
    log.info(`${controller_name}[${isIssuer.name}] -----> IN ...`)
    let issuerDID = req.swagger.params.issuerDID.value
    log.debug(`${controller_name}[${isIssuer.name}] -----> Sending params: ${issuerDID}`)
    entityService.isIssuer(issuerDID)
    .then(issuer => {
      log.info(`${controller_name}[${isIssuer.name}] -----> Successfully getted Issuer`)
      let status = issuer
      res.status(200).send(status)
function createCredential(req, res) {
  log.info(`${controller_name}[${createCredential.name}] -----> IN ...`)
  let credentials = req.swagger.params.credential.value
  let identityDID = req.swagger.params.identityDID.value
  log.debug(`${controller_name}[${createCredential.name}] -----> Sending params: ${JSON.stringify(credentials)}, ${identityDID}`)
  entityService.createCredential(identityDID, credentials)
  .then(credential => {
    log.info(`${controller_name}[${createCredential.name}] -----> Credentials created: ${credential}`)
    let credentialToken = {
      verifiableCredential: credential
    }
    res.status(200).send(credentialToken)
  })
  .catch(error => {
    log.error(`${controller_name}[${createCredential.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getSubjectCredentialList(req, res) {
  log.info(`${controller_name}[${getSubjectCredentialList.name}] -----> IN ...`)
  let subjectDID = req.swagger.params.identityDID.value
  log.debug(`${controller_name}[${getSubjectCredentialList.name}] -----> Sending params: ${subjectDID}`)
  entityService.getSubjectCredentialList(subjectDID)
  .then(credentialsList => {
    log.info(`${controller_name}[${getSubjectCredentialList.name}] -----> Successfully obtained Credential List`)
    res.status(200).send(credentialsList)
  })
  .catch(error => {
    log.error(`${controller_name}[${getSubjectCredentialList.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}
    })
  }
  catch(error) {
    log.error(`${controller_name}[${isIssuer.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  }
}

  try {
    log.info(`${controller_name}[${addIssuerCredential.name}] -----> IN ...`)
    let params = req.swagger.params.body.value
    log.debug(`${controller_name}[${addIssuerCredential.name}] -----> Sending params: ${JSON.stringify(params)}`)
    entityService.addIssuerCredential(params)
    .then(addSubjectPres => {
      log.info(`${controller_name}[${addIssuerCredential.name}] -----> Successfully added credential`)
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
    log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> IN ...`)
    let alastriaId = req.swagger.params.alastriaDID.value
    log.debug(`${controller_name}[${getCurrentPublicKey.name}] -----> Sending params: ${JSON.stringify(alastriaId)}`)
    entityService.getCurrentPublicKey(alastriaId)
    .then(publickey => {
      if (publickey[0].length > 0) {
        log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> Successfully obtained Public Key`)
        let result = {
          publicKey: publickey[0]
        }
        res.status(200).send(result)
      }
      else {
        log.info(`${controller_name}[${getCurrentPublicKey.name}] -----> Error getting publicKey`)
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
    log.info(`${controller_name}[${getPresentationStatus.name}] -----> IN ...`);
    let presentationHash = req.swagger.params.presentationHash.value;
    log.debug(`${controller_name}[${getPresentationStatus.name}] -----> Sending params: ${JSON.stringify(presentationHash)}`)
    let issuer = req.swagger.params.serviceProvider.value;
    let subject = req.swagger.params.subject.value;
    entityService.getPresentationStatus(presentationHash,issuer,subject)
    .then(presentationStatus => { 
      if (presentationStatus != null){
        log.info(`${controller_name}[${getPresentationStatus.name}] -----> Successfully obtained presentation status`);
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
    log.info(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> IN ...`);
    let presentationHash = req.swagger.params.presentationHash.value;
    log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Sending params: ${JSON.stringify(presentationHash)}`)
    let newStatus = req.swagger.params.body.value;    
    entityService.updateReceiverPresentationStatus(presentationHash,newStatus)
    .then(() => { 
      log.info(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Successfully updated status presentation`);
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
    log.info(`${controller_name}[${getCredentialStatus.name}] -----> IN ...`);
    let credentialHash = req.swagger.params.credentialHash.value;
    let issuer = req.swagger.params.issuer.value;
    let subject = req.swagger.params.subject.value;
    log.debug(`${controller_name}[${getCredentialStatus.name}] -----> Sending params: ${JSON.stringify(credentialHash, issuer, subject)}`)
    entityService.getCredentialStatus(credentialHash, issuer, subject)
    .then(credentialStatus => { 
      log.info(`${controller_name}[${getCredentialStatus.name}] -----> Successfully saved the credential`)
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
    log.info(`${controller_name}[${recivePresentationData.name}] -----> IN ...`);
    let presentationSigned = req.swagger.params.presentation.value
    log.debug(`${controller_name}[${recivePresentationData.name}] -----> Sending params: ${JSON.stringify(req.swagger.params.presentation.value)}`)
    entityService.getPresentationData(presentationSigned)
    .then(subjectData => {
      log.info(`${controller_name}[${recivePresentationData.name}] -----> Successfully obtained presentation data`);
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
    log.info(`${controller_name}[${verifyAlastriaSession.name}] -----> IN ...`)
    let alastriaSession = req.swagger.params.alastriaSession.value
    log.debug(`${controller_name}[${verifyAlastriaSession.name}] -----> Sending params: ${JSON.stringify(alastriaSession)}`)
    entityService.verifyAlastriaSession(alastriaSession)
    .then(verified => {
      log.info(`${controller_name}[${verifyAlastriaSession.name}] -----> Alastria Sesion verified successfuly`)
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

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
  getSubjectCredentialList,
  getSubjectCredentialStatus,
  updateIssuerCredentialStatus,
  getIssuerCredentialStatus,
  createPresentationRequest,
  getSubjectPresentationListFromIssuer,
  getSubjectPresentationStatus,
  updateReceiverPresentationStatus,
  getIssuerPresentationStatus,
  recivePresentationData
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
        publicKey: publickey
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
  log.info(`${controller_name}[${isIssuer.name}] -----> IN ...`)
  let issuerDID = req.swagger.params.issuerDID.value
  log.debug(`${controller_name}[${isIssuer.name}] -----> Sending params: ${issuerDID}`)
  entityService.isIssuer(issuerDID)
  .then(issuer => {
    log.info(`${controller_name}[${isIssuer.name}] -----> Successfully getted Issuer`)
    let status = issuer
    res.status(200).send(status)
  })
  .catch(error => {
    log.error(`${controller_name}[${isIssuer.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function createCredential(req, res) {
  log.info(`${controller_name}[${createCredential.name}] -----> IN ...`)
  let credentials = req.swagger.params.credential.value
  let identityDID = req.swagger.params.identityDID.value
  log.debug(`${controller_name}[${createCredential.name}] -----> Sending params: ${JSON.stringify(credentials)}, ${identityDID}`)
  entityService.createCredential(identityDID, credentials)
  .then(credential => {
    log.info(`${controller_name}[${createCredential.name}] -----> Credentials created`)
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

function getSubjectCredentialStatus(req, res) {
    log.info(`${controller_name}[${getSubjectCredentialStatus.name}] -----> IN ...`)
    let subjectPSMHash = req.swagger.params.subjectCredentialHash.value
    let subjectDID = req.swagger.params.subjectDID.value
    log.debug(`${controller_name}[${getSubjectCredentialStatus.name}] -----> Sending params: ${subjectPSMHash}, ${subjectDID}`)
    entityService.getSubjectCredentialStatus(subjectDID, subjectPSMHash)
    .then(resultStatus => {
      log.info(`${controller_name}[${getSubjectCredentialStatus.name}] -----> Successfully osbtained subject credential status`)
      let credentialStatus = {
        resultStatus
      }
      res.status(200).send(credentialStatus)
    })
    .catch(error => {
      log.error(`${controller_name}[${getSubjectCredentialStatus.name}] -----> ${error}`)
      Errmsg.message = error
      res.status(404).send(Errmsg)
    })
}

function updateIssuerCredentialStatus(req, res) {
  log.info(`${controller_name}[${updateIssuerCredentialStatus.name}] -----> IN ...`)
  let updateData = req.swagger.params.credentialStatusData.value
  log.debug(`${controller_name}[${updateIssuerCredentialStatus.name}] -----> Sending params: ${JSON.stringify(updateData)}`)
  entityService.updateIssuerCredentialStatus(updateData)
  .then(updatedStatus => {
    log.info(`${controller_name}[${updateIssuerCredentialStatus.name}] -----> Status Updated`)
    let statusUpdated = updatedStatus
    res.status(200).send(statusUpdated)
  })
  .catch(error => {
    log.error(`${controller_name}[${updateIssuerCredentialStatus.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getIssuerCredentialStatus(req, res) {
  log.info(`${controller_name}[${getIssuerCredentialStatus.name}] -----> IN ...`)
  let credentialHash = req.swagger.params.issuerCredentialHash.value
  let issuerDID = req.swagger.params.issuerDID.value
  log.debug(`${controller_name}[${getIssuerCredentialStatus.name}] -----> Sending params: ${credentialHash}, ${issuerDID}`)
  entityService.getIssuerCredentialStatus(issuerDID, credentialHash)
  .then(statusGetted => {
    log.info(`${controller_name}[${getIssuerCredentialStatus.name}] -----> Status getted`)
    let status = statusGetted
    res.status(200).send(status)
  })
  .catch(error => {
    log.error(`${controller_name}[${getIssuerCredentialStatus.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function createPresentationRequest(req, res) {
  log.info(`${controller_name}[${createPresentationRequest.name}] -----> IN ...`)
  let requestData = req.swagger.params.presentationRequestInfo.value
  log.debug(`${controller_name}[${createPresentationRequest.name}] -----> Sending params: ${JSON.stringify(requestData)}`)
  entityService.createPresentationRequest(requestData)
  .then(jwt => {
    log.info(`${controller_name}[${createPresentationRequest.name}] -----> Successfully generated Presentation Request`)
    let presentationRequest = jwt
    res.status(200).send(presentationRequest)
  })
  .catch(error => {
    log.error(`${controller_name}[${createPresentationRequest.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getSubjectPresentationListFromIssuer(req, res) {
  log.info(`${controller_name}[${getSubjectPresentationListFromIssuer.name}] -----> IN ...`)
  let subjectDID = req.swagger.params.subjectDID.value
  log.debug(`${controller_name}[${getSubjectPresentationListFromIssuer.name}] -----> Sending params: ${subjectDID}`)
  entityService.getSubjectPresentationList(subjectDID)
  .then(presentationList => {
    log.info(`${controller_name}[${getSubjectPresentationListFromIssuer.name}] -----> Successfully obtained presentation list`)
    res.status(200).send(presentationList)
  })
  .catch(error => {
    log.error(`${controller_name}[${getSubjectPresentationListFromIssuer.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function getSubjectPresentationStatus(req, res) {
  log.info(`${controller_name}[${getSubjectPresentationStatus.name}] -----> IN ...`)
  let subjectPresentationHash = req.swagger.params.subjectPresentationHash.value
  let subjectDID = req.swagger.params.subjectDID.value
  log.debug(`${controller_name}[${getSubjectPresentationStatus.name}] -----> Sending params: ${subjectPresentationHash}, ${subjectDID}`)
  entityService.getSubjectPresentationStatus(subjectDID, subjectPresentationHash)
  .then(status => {
    log.info(`${controller_name}[${getSubjectPresentationStatus.name}] -----> Successfully obtained subject presentation status`)
    let gettedStatus = {
      presentationStatus: status
    }
    res.status(200).send(gettedStatus)
  })
  .catch(error => {
    log.error(`${controller_name}[${getSubjectPresentationStatus.name}] -----> ${error}`)
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function updateReceiverPresentationStatus(req, res){
  log.info(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> IN ...`);
  let presentationHash = req.swagger.params.presentationHash.value;
  let newStatus = req.swagger.params.status.value.newStatus;
  log.debug(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Sending params: ${presentationHash}, ${newStatus}`)
  entityService.updateReceiverPresentationStatus(presentationHash, newStatus)
  .then(status => { 
    log.info(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> Successfully updated status presentation`);
    let gettedStatus = {
      presentationStatus: status
    }
    res.status(200).send(gettedStatus);
  })
  .catch(error => {
    log.error(`${controller_name}[${updateReceiverPresentationStatus.name}] -----> ${error}`);
    Errmsg.message = error
    res.status(404).send(Errmsg)
  }) 
}

function getIssuerPresentationStatus(req, res) {
  log.info(`${controller_name}[${getIssuerPresentationStatus.name}] -----> IN ...`)
  let presentationHash = req.swagger.params.issuerPresentationHash.value
  let issuerDID = req.swagger.params.issuerDID.value
  log.debug(`${controller_name}[${getIssuerPresentationStatus.name}] -----> Sending params: ${presentationHash}, ${issuerDID}`)
  entityService.getIssuerPresentationStatus(issuerDID, presentationHash)
  .then(status => {
    console.log(status)
    let gettedStatus = {
      presentationStatus: status
    }
    res.status(200).send(gettedStatus);
  })
  .catch(error => {
    log.error(`${controller_name}[${getIssuerPresentationStatus.name}] -----> ${error}`);
    Errmsg.message = error
    res.status(404).send(Errmsg)
  })
}

function recivePresentationData(req, res) {
  log.info(`${controller_name}[${recivePresentationData.name}] -----> IN ...`);
  console.log(req.swagger.params.presentation.value)
  let presentationSigned = req.swagger.params.presentation.value
  let presentationHash = req.swagger.params.presentationRequestHash.value
  log.debug(`${controller_name}[${recivePresentationData.name}] -----> Sending params: ${presentationSigned}, ${presentationHash}`)
  entityService.getPresentationData(presentationSigned, presentationHash)
  .then(subjectData => {
    log.info(`${controller_name}[${recivePresentationData.name}] -----> Successfully obtained presentation data`);
    io.emit('getPresentationData', {status: 200,
                                    message: subjectData})
    res.status(200).send(subjectData)
  })
  .catch(error => {
    Errmsg.message = (error == false) ? 'Clave pública no válida' : 'Error obteniendo los datos de la presentación'
    log.error(`${controller_name}[${recivePresentationData.name}] -----> ${Errmsg.message}`);
    io.emit('error', {status: 400,
                      message: Errmsg.message})
    res.status(400).send(Errmsg)
  })
}


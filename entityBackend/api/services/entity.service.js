'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const Log = require('log4js')
const keythereum = require('keythereum')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()
const web3Helper = require('../helpers/web3.helper')
const web3 = web3Helper.getWeb3()
const userModel = require('../models/user.model')
const serviceName = '[Entity Service]'
const log = Log.getLogger()
log.level = myConfig.Log.level

let issuerKeystore = myConfig.issuerKeystore
let issuerIdentity, issuerPrivateKey
let subjectKeystore = myConfig.subjectKeystore
let subjectIdentity, subjectPrivateKey



/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function getSubjectIdentity() {
  try {
    log.debug(`${serviceName}[${getSubjectIdentity.name}] -----> IN ...`)
    subjectPrivateKey = keythereum.recover(myConfig.addressPassword, subjectKeystore)
    subjectIdentity = new UserIdentity(web3, `0x${subjectKeystore.address}`, subjectPrivateKey)
    log.debug(`${serviceName}[${getSubjectIdentity.name}] -----> Subject Getted`)
    return subjectIdentity
  } catch (error) {
    log.error(`${serviceName}[${getSubjectIdentity.name}] -----> ${error}`)
    return error
  }
}

function getIssuerIdentity() {
  try {
    log.debug(`${serviceName}[${getIssuerIdentity.name}] -----> IN ...`)
    issuerPrivateKey = keythereum.recover(myConfig.addressPassword, issuerKeystore)
    issuerIdentity = new UserIdentity(web3, `0x${issuerKeystore.address}`, issuerPrivateKey)
    log.debug(`${serviceName}[${getIssuerIdentity.name}] -----> Issuer Getted`)
    return issuerIdentity
  } catch (error) {
    log.error(`${serviceName}[${getIssuerIdentity.name}] -----> ${error}`)
    return error
  }
}

function sendSigned(transactionSigned) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${sendSigned.name}] -----> IN ...`)
    web3.eth.sendSignedTransaction(transactionSigned)
    .on('transactionHash', function (hash) {
      log.debug(`${serviceName}[${sendSigned.name}] -----> HASH: ${hash} ...`)
    })
    .on('receipt', receipt => {
      resolve(receipt)
    })
    .on('error', error => {
      log.error(`${serviceName}[${sendSigned.name}] -----> ${error}`)
      reject(error)
    });
  })
}

function subjectGetKnownTransaction(subjectCredential) {
  return new Promise((resolve, reject) => {
    let subjectID = getSubjectIdentity()
    subjectID.getKnownTransaction(subjectCredential)
    .then(receipt => {
      resolve(receipt)
    })
    .catch(error => {
      reject(error)
    })
  })
}

function issuerGetKnownTransaction(issuerCredential) {
  return new Promise((resolve, reject) => {
    let issuerID = getIssuerIdentity()
    issuerID.getKnownTransaction(issuerCredential)
    .then(receipt => {
      resolve(receipt)
    })
    .catch(error => {
      reject(error)
    })
  })
}

function preparedAlastriaId() {
  try {
    let preparedId = transactionFactory.identityManager.prepareAlastriaID(web3, subjectKeystore.address)
    return preparedId
  } 
  catch(error) {
    return error
  }
}

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  createAlastriaID,
  addIssuerCredential,
  getCurrentPublicKey,
  getpresentationStatus,
  updateReceiverPresentationStatus,
  addSubjectPresentation,
  getCredentialStatus,
  getSubjectData,
  verifyAlastriaSesion
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function createAlastriaID(params) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${createAlastriaID.name}] -----> IN ...`)
    let decodedAIC = tokensFactory.tokens.decodeJWT(params.signedAIC)
    let signedCreateTransaction = decodedAIC.payload.createAlastriaTX
    console.log("signedCreateTransaction", signedCreateTransaction)
    let preparedId = preparedAlastriaId()
    issuerGetKnownTransaction(preparedId)
    .then(signedPreparedTransaction => {
      sendSigned(signedPreparedTransaction)
      .then(prepareSendSigned => {
        sendSigned(signedCreateTransaction)
        .then(createSendSigned => {
          web3.eth.call({
            to: config.alastriaIdentityManager,
            data: web3.eth.abi.encodeFunctionCall(config.contractsAbi['AlastriaIdentityManager']['identityKeys'], [issuerKeystore.address])
          })
          .then(AlastriaIdentity => {
            let alastriaDID = tokensFactory.tokens.createDID('quor', AlastriaIdentity.slice(26));
            let objectIdentity = {
              proxyAddress: `0x${AlastriaIdentity.slice(26)}`,
              did: alastriaDID
            }
            resolve(objectIdentity)
          })
          .catch(error => {
            log.error(`${serviceName}[${createAlastriaID.name}] -----> ${error}`)
            reject(error)
          })
        })
        .catch(error => {
          log.error(`${serviceName}[${createAlastriaID.name}] -----> ${error}`)
          reject(error)
        })
      })
      .catch(error => {
        log.error(`${serviceName}[${createAlastriaID.name}] -----> ${error}`)
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${serviceName}[${createAlastriaID.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function addIssuerCredential(params) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${addIssuerCredential.name}] -----> IN ...`)
    log.debug(`${serviceName}[${addIssuerCredential.name}] -----> Calling addIssuer credential With params: ${JSON.stringify(params)}`)
    let issuerCredential = transactionFactory.credentialRegistry.addIssuerCredential(web3, params.issuerCredentialHash)
    subjectGetKnownTransaction(issuerCredential)
    .then(issuerCredentialSigned => {
      sendSigned(issuerCredentialSigned)
      .then(receipt => {
        let issuerCredentialTransaction = transactionFactory.credentialRegistry.getIssuerCredentialStatus(web3, params.issuer, params.issuerCredentialHash)
        web3.eth.call(issuerCredentialTransaction)
        .then(IssuerCredentialStatus => {
          let result = web3.eth.abi.decodeParameters(["bool", "uint8"], IssuerCredentialStatus)
          let credentialStatus = {
            "exists": result[0],
            "status": result[1]
          }
          log.debug(`${serviceName}[${addIssuerCredential.name}] -----> Success`)
          resolve(credentialStatus)
        }).catch(error => {
          log.error(`${serviceName}[${addIssuerCredential.name}] -----> ${error}`)
          reject(error)
        })
      })
      .catch(error => {
        log.error(`${serviceName}[${addIssuerCredential.name}] -----> ${error}`)
        reject(error)
      })
    })
  })
}

function addSubjectPresentation(params) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${addSubjectPresentation.name}] -----> IN ...`)
    let subjectPres = transactionFactory.presentationRegistry.addSubjectPresentation(web3, params.subjectPresentationHash, params.uri)
    subjectGetKnownTransaction(subjectPres)
    .then(subjectPresSigned => {
      sendSigned(subjectPresSigned)
      .then(receipt => {
        let subjectPresTx = transactionFactory.presentationRegistry.getSubjectPresentationStatus(web3, params.subject, params.subjectPresentationHash)
        web3.eth.call(subjectPresTx)
        .then(subjectPresStatus => {
          let result = web3.eth.abi.decodeParameters(["bool", "uint8"], subjectPresStatus)
          let credentialStatus = {
            "exists": result[0],
            "status": result[1]
          }
          log.debug(`${serviceName}[${addSubjectPresentation.name}] -----> Success`)
          resolve(credentialStatus)
        }).catch(error => {
          log.error(`${serviceName}[${addSubjectPresentation.name}] -----> ${error}`)
          reject(error)
        })
      })
      .catch(error => {
        log.error(`${serviceName}[${addSubjectPresentation.name}] -----> ${error}`)
        reject(error)
      })
    })
  })
}

function getCurrentPublicKey(subject) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${getCurrentPublicKey.name}] -----> IN ...`)
    let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject)
    web3.eth.call(currentPubKey)
    .then(result => {
      log.debug(`${serviceName}[${getCurrentPublicKey.name}] -----> Success`)
      let pubKey = web3.eth.abi.decodeParameters(['string'], result) 
      resolve(pubKey)
    })
    .catch(error => {
      log.error(`${serviceName}[${getCurrentPublicKey.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function getpresentationStatus(presentationHash, issuer, subject) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${getpresentationStatus.name}] -----> IN ...`)
    let presentationStatus = null;
    if (issuer != null) {
      presentationStatus = transactionFactory.presentationRegistry.getReceiverPresentationStatus(web3, issuer, presentationHash);
    } else if (subject != null) {
      presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(web3, subject, presentationHash);
    }
    if (presentationStatus != null) {
      web3.eth.call(presentationStatus)
      .then(result => {
        let resultStatus = web3.eth.abi.decodeParameters(["bool", "uint8"], result)
        let resultStatusJson = {
          exist: resultStatus[0],
          status: resultStatus[1]
        }
        log.debug(`${serviceName}[${getpresentationStatus.name}] -----> Success`)
        resolve(resultStatusJson);
      })
      .catch(error => {
        log.error(`${serviceName}[${getpresentationStatus.name}] -----> ${error}`)
        reject(error)
      })
    }
  });
}

function updateReceiverPresentationStatus(presentationHash, newStatus) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> IN ...`)
    let updatepresentationStatus = transactionFactory.presentationRegistry.updateReceiverPresentation(web3, presentationHash, newStatus.newStatus);
    issuerGetKnownTransaction(updatepresentationStatus)
    .then(updatepresentationStatusSigned => {
      sendSigned(updatepresentationStatusSigned)
      .then(receipt => {
        log.debug(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> Success`)
        resolve();
      })
      .catch(error => {
        log.error(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> ${error}`)
        reject(error)
      })
    })
  })
}

function getCredentialStatus(credentialHash, issuer, subject) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${getCredentialStatus.name}] -----> IN ...`)
    let credentialStatus = null;
    if (issuer != null) {
      credentialStatus = transactionFactory.credentialRegistry.getIssuerCredentialStatus(web3, issuer, credentialHash);
    } else if (subject != null) {
      credentialStatus = transactionFactory.credentialRegistry.getSubjectCredentialStatus(web3, subject, credentialHash);
    }
    if (credentialStatus != null) {
      web3.eth.call(credentialStatus)
      .then(result => {
        let resultStatus = web3.eth.abi.decodeParameters(["bool", "uint8"], result)
        let resultStatusJson = {
          exist: resultStatus[0],
          status: resultStatus[1]
        }
        log.debug(`${serviceName}[${getCredentialStatus.name}] -----> Success`)
        resolve(resultStatusJson);
      })
      .catch(error => {
        log.error(`${serviceName}[${getCredentialStatus.name}] -----> ${error}`)
        reject(error)
      })
    }
  });
}

function getSubjectData(pubkey, presentationSigned) { 
  return new Promise((resolve, reject) => { 
    log.debug(`${serviceName}[${getSubjectData.name}] -----> IN ...`) 
    let verified = tokensFactory.tokens.verifyJWT(presentationSigned, `04${pubkey.substr(2)}`) 
    if (verified == true) { 
      log.debug(`${serviceName}[${getSubjectData.name}] -----> Subject presentation verified`) 
      let presentationData = tokensFactory.tokens.decodeJWT(presentationSigned) 
      if (presentationData.payload) { 
        log.debug(`${serviceName}[${getSubjectData.name}] -----> JWT decoded successfuly`) 
        resolve(presentationData) 
      } else { 
        log.error(`${serviceName}[${getSubjectData.name}] -----> Error decoding JWT`) 
        reject(presentationData) 
      } 
    } else { 
      log.error(`${serviceName}[${getSubjectData.name}] -----> Error verifying JWT`) 
      reject(verified) 
    } 
  }) 
}

function verifyAlastriaSesion(alastriaSesion) {
  return new Promise((resolve, reject) => {
    log.debug(`${serviceName}[${verifyAlastriaSesion.name}] -----> IN...`)
    let decode = tokensFactory.tokens.decodeJWT(alastriaSesion.signedAIC)
    let didSubject = decode.payload.iss.split(':')[4]
    log.debug(`${serviceName}[${verifyAlastriaSesion.name}] -----> Obtained correctly the Subject DID`)
    getCurrentPublicKey(didSubject)
    .then(subjectPublicKey => {
      let publicKey = subjectPublicKey[0]
      log.debug(`${serviceName}[${verifyAlastriaSesion.name}] -----> Obtained correctly the Subject PublicKey`)
      let verifiedAlastraSesion = tokensFactory.tokens.verifyJWT(alastriaSesion.signedAIC, `04${publicKey}`)
      if(verifiedAlastraSesion == true) {
        userModel.getUser(decode.payload.iss)
        .then(user => {
          let loged = (user == null) ? verifiedAlastraSesion : user
          resolve(loged)
        })
        .catch(error => {
          log.error(`${serviceName}[${verifyAlastriaSesion.name}] -----> ${error}`)
          reject(error)
        })
      }
    })
    .catch(error => {
      log.error(`${serviceName}[${verifyAlastriaSesion.name}] -----> ${error}`)
      reject(error)
    })
  })
 }


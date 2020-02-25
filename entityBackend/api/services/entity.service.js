'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const Log = require('log4js')
const keythereum = require('keythereum')
const EthCrypto = require('eth-crypto')
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



/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function getIssuerIdentity() {
  try {
    log.info(`${serviceName}[${getIssuerIdentity.name}] -----> IN ...`)
    issuerPrivateKey = keythereum.recover(myConfig.addressPassword, issuerKeystore)
    issuerIdentity = new UserIdentity(web3, `0x${issuerKeystore.address}`, issuerPrivateKey)
    log.info(`${serviceName}[${getIssuerIdentity.name}] -----> Issuer Getted`)
    return issuerIdentity
  } catch (error) {
    log.error(`${serviceName}[${getIssuerIdentity.name}] -----> ${error}`)
    throw error
  }
}

function sendSigned(transactionSigned) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${sendSigned.name}] -----> IN ...`)
    web3.eth.sendSignedTransaction(transactionSigned)
    .on('transactionHash', function (hash) {
      log.info(`${serviceName}[${sendSigned.name}] -----> HASH: ${hash} ...`)
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

function getAddressFromPubKey(publicKey) {
  try {
    log.info(`${serviceName}[${getAddressFromPubKey.name}] -----> IN ...`)
    let address = EthCrypto.publicKey.toAddress(publicKey)
    log.info(`${serviceName}[${getAddressFromPubKey.name}] -----> Getted address`)
    return address
  }
  catch(error) {
    log.error(`${serviceName}[${getAddressFromPubKey.name}] -----> ${error}`)
    throw error
  }
}

function preparedAlastriaId(subjectAddress) {
  try {
    let preparedId = transactionFactory.identityManager.prepareAlastriaID(web3, subjectAddress)
    return preparedId
  } 
  catch(error) {
    throw error
  }
}

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
  getPresentationData,
  verifyAlastriaSession
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function createAlastriaID(params) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${createAlastriaID.name}] -----> IN ...`)
    let decodedAIC = tokensFactory.tokens.decodeJWT(params.signedAIC)
    let subjectAddress = getAddressFromPubKey(decodedAIC.payload.publicKey)
    let signedCreateTransaction = decodedAIC.payload.createAlastriaTX
    let preparedId = preparedAlastriaId(subjectAddress)
    issuerGetKnownTransaction(preparedId)
    .then(signedPreparedTransaction => {
      sendSigned(signedPreparedTransaction)
      .then(prepareSendSigned => {
        sendSigned(signedCreateTransaction)
        .then(createSendSigned => {
          web3.eth.call({
            to: config.alastriaIdentityManager,
            data: web3.eth.abi.encodeFunctionCall(config.contractsAbi['AlastriaIdentityManager']['identityKeys'], [subjectAddress.substr(2)])
          })
          .then(AlastriaIdentity => {
            let alastriaDID = tokensFactory.tokens.createDID('quor', AlastriaIdentity.slice(26));
            let msg = {
              message: "Successfuly created Alastria ID",
              did: alastriaDID
            }
            resolve(msg)
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
    log.info(`${serviceName}[${addIssuerCredential.name}] -----> IN ...`)
    log.debug(`${serviceName}[${addIssuerCredential.name}] -----> Calling addIssuer credential With params: ${JSON.stringify(params)}`)
    let issuerCredential = transactionFactory.credentialRegistry.addIssuerCredential(web3, params.issuerCredentialHash)
    issuerGetKnownTransaction(issuerCredential)
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
          log.info(`${serviceName}[${addIssuerCredential.name}] -----> Success`)
          resolve(credentialStatus)
        })
        .catch(error => {
          log.error(`${serviceName}[${addIssuerCredential.name}] -----> ${error}`)
          reject(error)
        })
      })
      .catch(error => {
        log.error(`${serviceName}[${addIssuerCredential.name}] -----> ${error}`)
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${serviceName}[${addIssuerCredential.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function getCurrentPublicKey(subject) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${getCurrentPublicKey.name}] -----> IN ...`)
    let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject.split(':')[4]) // Remove split when the library accepts the DID and not the proxyAddress
    web3.eth.call(currentPubKey)
    .then(result => {
      log.info(`${serviceName}[${getCurrentPublicKey.name}] -----> Success`)
      let pubKey = web3.eth.abi.decodeParameters(['string'], result) 
      resolve(pubKey)
    })
    .catch(error => {
      log.error(`${serviceName}[${getCurrentPublicKey.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function getPresentationStatus(presentationHash, issuer, subject) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${getPresentationStatus.name}] -----> IN ...`)
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
        log.info(`${serviceName}[${getPresentationStatus.name}] -----> Success`)
        resolve(resultStatusJson);
      })
      .catch(error => {
        log.error(`${serviceName}[${getPresentationStatus.name}] -----> ${error}`)
        reject(error)
      })
    }
  });
}

function updateReceiverPresentationStatus(presentationHash, newStatus) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> IN ...`)
    let updatepresentationStatus = transactionFactory.presentationRegistry.updateReceiverPresentation(web3, presentationHash, newStatus.newStatus);
    issuerGetKnownTransaction(updatepresentationStatus)
    .then(updatepresentationStatusSigned => {
      sendSigned(updatepresentationStatusSigned)
      .then(receipt => {
        log.info(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> Success`)
        resolve();
      })
      .catch(error => {
        log.error(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> ${error}`)
        reject(error)
      })
    })
    .catch(error => {
      log.error(`${serviceName}[${updateReceiverPresentationStatus.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function getCredentialStatus(credentialHash, issuer, subject) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${getCredentialStatus.name}] -----> IN ...`)
    let credentialStatus = null;
    if (issuer != null) {
      let didIssuer = issuer.split(':')[4]
      credentialStatus = transactionFactory.credentialRegistry.getIssuerCredentialStatus(web3, didIssuer, credentialHash);
    } else if (subject != null) {
      let didSubject = subject.split(':')[4]
      credentialStatus = transactionFactory.credentialRegistry.getSubjectCredentialStatus(web3, didSubject, credentialHash);
    }
    if (credentialStatus.exists == true) {
      web3.eth.call(credentialStatus)
      .then(result => {
        let resultStatus = web3.eth.abi.decodeParameters(["bool", "uint8"], result)
        let resultStatusJson = {
          exist: resultStatus[0],
          status: resultStatus[1]
        }
        log.info(`${serviceName}[${getCredentialStatus.name}] -----> Success`)
        resolve(resultStatusJson);
      })
      .catch(error => {
        log.error(`${serviceName}[${getCredentialStatus.name}] -----> ${error}`)
        reject(error)
      })
    } else {
      let msg = {
        message: "Credential not saved"
      }
      reject(msg)
    }
  })
}

function getPresentationData(data) { 
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${getPresentationData.name}] -----> IN ...`) 
    let presentationSigned = data
    getCurrentPublicKey(presentationSigned.payload.aud)
    .then(subjectPublicKey => {
      let publicKey = subjectPublicKey[0]
      let credentials = []
      let verifiableCredential = presentationSigned.payload.vp.verifiableCredential
      verifiableCredential.map( item => {
        let verifyCredential = tokensFactory.tokens.verifyJWT(item, `04${publicKey}`)
        if(verifyCredential == true) {
          let credential = tokensFactory.tokens.decodeJWT(item)
          credentials.push(JSON.parse(credential.payload).vc.credentialSubject)
        } else {
          log.error(`${serviceName}[${getPresentationData.name}] -----> Error verifying Credential JWT`)
          reject(verifyCredential)
        }
      })
      resolve(credentials)
    })
    .catch(error => {
      log.error(`${serviceName}[${getPresentationData.name}] -----> ${error}`)
      reject(error)
    })
  }) 
}

function verifyAlastriaSession(alastriaSession) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${verifyAlastriaSession.name}] -----> IN...`)
    let decode = tokensFactory.tokens.decodeJWT(alastriaSession.signedAIC)
    let didSubject = decode.payload.pku.id
    log.info(`${serviceName}[${verifyAlastriaSession.name}] -----> Obtained correctly the Subject DID`)
    getCurrentPublicKey(didSubject)
    .then(subjectPublicKey => {
      let publicKey = subjectPublicKey[0]
      log.info(`${serviceName}[${verifyAlastriaSession.name}] -----> Obtained correctly the Subject PublicKey`)
      let verifiedAlastraSession = tokensFactory.tokens.verifyJWT(alastriaSession.signedAIC, `04${publicKey}`)
      if(verifiedAlastraSession == true) {
        userModel.getUser(didSubject)
        .then(user => {
          let msg = {
            message: "User not found",
            did: didSubject
          }
          let result = (user == null) ? msg : user
          resolve(result)
        })
        .catch(error => {
          log.error(`${serviceName}[${verifyAlastriaSession.name}] -----> ${error}`)
          reject(error)
        })
      } else {
        log.error(`${serviceName}[${verifyAlastriaSession.name}] -----> Unauthorized`)
        reject('User Unauthorized')
      }
    })
    .catch(error => {
      log.error(`${serviceName}[${verifyAlastriaSession.name}] -----> ${error}`)
      reject(error)
    })
  })
 }


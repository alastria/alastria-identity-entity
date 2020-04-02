'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const { transactionFactory, config } = require('alastria-identity-lib')
const EthCrypto = require('eth-crypto')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()
const web3Helper = require('../helpers/web3.helper')
const web3 = web3Helper.getWeb3()
const userModel = require('../models/user.model')
const identityUser = require('../helpers/userIdentity.helper')
const tokenHelper = require('../helpers/token.helper')
const serviceName = '[Entity Service]'
const Log = require('log4js')
const log = Log.getLogger()
log.level = myConfig.Log.level

/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

// function sendSigned(transactionSigned) {
//   return new Promise((resolve, reject) => {
//   log.info(`${serviceName}[${sendSigned.name}] -----> IN ...`)
//   web3.eth.sendSignedTransaction(transactionSigned)
//   .on('transactionHash', function (hash) {
//       log.info(`${serviceName}[${sendSigned.name}] -----> HASH: ${hash} ...`)
//   })
//   .on('receipt', receipt => {
//       resolve(receipt)
//   })
//   .on('error', error => {
//       log.error(`${serviceName}[${sendSigned.name}] -----> ${error}`)
//       reject(error)
//     });
//   })
// }
        
async function sendSigned(transactionSigned) {
  try {
    log.info(`${serviceName}[${sendSigned.name}] -----> IN ...`)
    let result = await web3.eth.sendSignedTransaction(transactionSigned)
    return result
  }
  catch(error) {
    throw error
  }
}

async function issuerGetKnownTransaction(issuerCredential) {
  try {
    let issuerID = await identityUser.getUserIdentity(web3, myConfig.entityEthAddress, myConfig.entityPrivateKey)
    let issuerTX = await issuerID.getKnownTransaction(issuerCredential)
    return issuerTX
  }
  catch(error) {
    return error
  }
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
  createAlastriaToken,
  verifyAlastriaSession,
  createAlastriaID,
  addIssuerCredential,
  getCurrentPublicKey,
  getCurrentPublicKeyList,
  addEntity,
  getEntities,
  getEntity,
  getPresentationStatus,
  updateReceiverPresentationStatus,
  getCredentialStatus,
  getPresentationData,
  verifyAlastriaSession
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

async function createAlastriaToken() {
  try {
    log.info(`${serviceName}[${createAlastriaToken.name}] -----> IN ...`)
    const currentDate = Math.floor(Date.now() / 1000);
    const expDate = currentDate + 600;
    let alastriaTokenData = {
      iss: myConfig.entityDID,
      gwu: myConfig.nodeUrl.alastria,
      cbu: `${myConfig.callbackUrl}alastria/alastriaToken`,
      exp: expDate,
      ani: myConfig.netID,
      nbf: currentDate,
      jti: Math.random().toString(36).substring(2)
    }
    let alastriaToken = await tokenHelper.createAlastriaToken(alastriaTokenData)
    let AlastriaTokenSigned = await tokenHelper.signJWT(alastriaToken, myConfig.entityPrivateKey)
    return AlastriaTokenSigned
  }
  catch(error) {
    log.error(`${serviceName}[${createAlastriaToken.name}] -----> ${error}`)
    throw error
  }
}

async function verifyAlastriaSession(alastriaSession) {
  try {
    log.info(`${serviceName}[${verifyAlastriaSession.name}] -----> IN...`)
    let decodeAS = await tokenHelper.decodeJWT(alastriaSession)
    let didSubject = decodeAS.payload.pku.id
    log.info(`${serviceName}[${verifyAlastriaSession.name}] -----> Obtained correctly the Subject DID`)
    let subjectPublicKey = await getCurrentPublicKey(didSubject)
    let publicKey = subjectPublicKey[0]
    log.info(`${serviceName}[${verifyAlastriaSession.name}] -----> Obtained correctly the Subject PublicKey`)
    let verifiedAlastraSession = await tokenHelper.verifyJWT(alastriaSession, `04${publicKey}`)
    if(verifiedAlastraSession == true) {
      let user = await userModel.getUser(didSubject)
      let msg = {
        message: "User not found, Unauthorized",
        did: didSubject
      }
      let result = (user == null) ? msg : user
      return result
    } else {
      log.error(`${serviceName}[${verifyAlastriaSession.name}] -----> Error verifying the Alastria Session`)
      throw 'User Unauthorized'
    }

  }
  catch(error) {
    log.error(`${serviceName}[${verifyAlastriaSession.name}] -----> ${error}`)
    throw error
  }
 }

 async function createAlastriaID(params) {
  try {
    console.log(params)
    log.info(`${serviceName}[${createAlastriaID.name}] -----> IN ...`)
    let decodedAIC = await tokenHelper.decodeJWT(params)
    let subjectAddress = getAddressFromPubKey(decodedAIC.payload.publicKey)
    let signedCreateTransaction = decodedAIC.payload.createAlastriaTX
    let preparedId = preparedAlastriaId(subjectAddress)
    let signedPreparedTransaction = await issuerGetKnownTransaction(preparedId)
    let prepareSendSigned = await sendSigned(signedPreparedTransaction)
    let createSendSigned = await sendSigned(signedCreateTransaction)
    let alastriaIdentity = await web3.eth.call({
      to: config.alastriaIdentityManager,
      data: web3.eth.abi.encodeFunctionCall(config.contractsAbi['AlastriaIdentityManager']['identityKeys'], [subjectAddress.substr(2)])
    })
    let alastriaDID = await tokenHelper.createDID('quor', alastriaIdentity.slice(26));
    let msg = {
      message: "Successfuly created Alastria ID",
      did: alastriaDID
    }
    return msg
  }
  catch(error) {
    log.error(`${serviceName}[${createAlastriaID.name}] -----> ${error}`)
    throw error
  }
}

async function getCurrentPublicKey(subject) {
  try {
    log.info(`${serviceName}[${getCurrentPublicKey.name}] -----> IN ...`)
    let currentPubKey = await transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject.split(':')[4]) // Remove split when the library accepts the DID and not the proxyAddress
    let result = await web3.eth.call(currentPubKey)
    log.info(`${serviceName}[${getCurrentPublicKey.name}] -----> Public Key Success`)
    let identityPubKey = web3.eth.abi.decodeParameters(['string'], result) 
    return identityPubKey
  }
  catch(error) {
    log.error(`${serviceName}[${getCurrentPublicKey.name}] -----> ${error}`)
    throw error
  }
}

async function getCurrentPublicKeyList(subject) {
  try {
    log.info(`${serviceName}[${getCurrentPublicKeyList.name}] -----> IN ...`)
    let publicKeyList = []
    let currentPubKey = await transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject.split(':')[4])
    let result = await web3.eth.call(currentPubKey)
    log.info(`${serviceName}[${getCurrentPublicKey.name}] -----> Public Key Success`)
    let identityPubKey = web3.eth.abi.decodeParameters(['string'], result)
    let publicKeyStatus = await transactionFactory.publicKeyRegistry.getPublicKeyStatus(web3, subject.split(':')[4], identityPubKey[0])
    publicKeyList.push(publicKeyStatus)
    return publicKeyList
  }
  catch(error) {
    log.error(`${serviceName}[${getCurrentPublicKeyList.name}] -----> ${error.message.split(':')[0]}`)
    throw error.message.split(':')[0]
  }
}

async function addEntity(entityData) {
  try {
    log.info(`${serviceName}[${addEntity.name}] -----> IN ...`)
    console.log(entityData)
    let entity = await getEntity(entityData.didEntity)
    if(entity) {
      throw "This AlastriaDID is already an Entity"
    }
    let entityTX = await transactionFactory.identityManager.addEntity(web3, entityData.didEntity.split(':')[4], entityData.name, entityData.cif,
                                                                        entityData.logoURL, entityData.createAlastriaIdentityURL, entityData.alastriaOpenAccessURL,
                                                                        entityData.active)
    let entitySignedTX = await issuerGetKnownTransaction(entityTX)
    let sendSignedTX = await sendSigned(entitySignedTX)
    log.info(`${serviceName}[${addEntity.name}] -----> Added New Entity`)
    entity = await getEntity(entityData.didEntity)
    return entity
  }
  catch(error) {
    log.error(`${serviceName}[${addEntity.name}] -----> ${error}`)
    throw error
  }
}

async function getEntities() {
  try {
    log.info(`${serviceName}[${getEntities.name}] -----> IN ...`)
    let entitiesList = await transactionFactory.identityManager.entitiesList(web3)
    let list = await web3.eth.call(entitiesList)
		let resultList = web3.eth.abi.decodeParameter("address[]", list)
    log.info(`${serviceName}[${getEntities.name}] -----> Getted Entities List`)
    return resultList
  }
  catch(error) {
    log.error(`${serviceName}[${getEntities.name}] -----> ${error}`)
    throw error
  }
}

async function getEntity(entityDID) {
  try {
    log.info(`${serviceName}[${getEntity.name}] -----> IN ...`)
    let entityTX = await transactionFactory.identityManager.getEntity(web3, entityDID.split(':')[4])
    let result = await web3.eth.call(entityTX)
    let entityDecode = web3.eth.abi.decodeParameters(["string", "string", "string", "string", "string", "bool"], result)
    let entity = {
      "name": entityDecode[0],
      "cif":entityDecode[1],
      "urlLogo":entityDecode[2],
      "urlCreateAID":entityDecode[3],
      "urlAOA":entityDecode[4],
      "status":entityDecode[5]
    }
    log.info(`${serviceName}[${getEntity.name}] -----> Getted Entity Data`)
    if(entity.status == false) {
      throw "This AlastriaDID is not an Entity"
    }
    return entity
  }
  catch(error) {
    log.error(`${serviceName}[${getEntity.name}] -----> ${error}`)
    throw error
  }
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
      log.info(`${serviceName}[${getCurrentPublicKey.name}] -----> Public Key Success`)
      let pubKey = web3.eth.abi.decodeParameters(['string'], result) 
      resolve(pubKey)
    })
    .catch(error => {
      log.error(`${serviceName}[${getCurrentPublicKey.name}] -----> ${error}`)
      reject(error)
    })
  })
}

function getPresentationStatus(subject, issuer, presentationHash) {
  return new Promise((resolve, reject) => {
    log.info(`${serviceName}[${getPresentationStatus.name}] -----> IN ...`)
    let presentationStatus = null;
    if (issuer != null) {
      presentationStatus = transactionFactory.presentationRegistry.getReceiverPresentationStatus(web3, issuer.split(':')[4], presentationHash);
    } else if (subject != null) {
      presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(web3, subject.split(':')[4], presentationHash);
    }
    if (presentationStatus != null) {
      web3.eth.call(presentationStatus)
      .then(result => {
        let resultStatus = web3.eth.abi.decodeParameters(["bool", "uint8"], result)
        let resultStatusJson = {
          exist: resultStatus[0],
          status: resultStatus[1]
        }
        log.info(`${serviceName}[${getPresentationStatus.name}] -----> Presentation Status Success`)
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
        log.info(`${serviceName}[${getCredentialStatus.name}] -----> Credential Status Success`)
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
    let subjectDID = presentationSigned.header.kid
    let subjectPSMHash = presentationSigned.payload.vp.procHash
    getPresentationStatus(subjectDID, null, subjectPSMHash)
    .then(status => {
      log.debug(`${serviceName}[${getPresentationData.name}] -----> STATUS: ${JSON.stringify(status)}`)
      if (status.exist) {
        getCurrentPublicKey(subjectDID)
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
          log.info(`${serviceName}[${getPresentationData.name}] -----> Credential obtained Success`)
          resolve(credentials)
        })
        .catch(error => {
          log.error(`${serviceName}[${getPresentationData.name}] -----> ${error}`)
          reject(error)
        })
      } else {
        let msg = {
          message: 'Presentation not registered'
        }
        log.error(`${serviceName}[${getPresentationData.name}] -----> ${msg.message}`)
        reject(msg)
      }
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


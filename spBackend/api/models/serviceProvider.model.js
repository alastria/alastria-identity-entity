'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const Log = require('log4js')
const keythereum = require('keythereum')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()
const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const web3Helper = require('../helpers/web3.helper')
const moduleName = '[serviceProvider Model]'
const web3 = web3Helper.getWeb3()
const log = Log.getLogger()
log.level = myConfig.Log.level

let issuerKeystore = myConfig.adminKeystore
let issuerIdentity, identityPrivateKey

let identityKeystore = myConfig.identityKeystore
let subjectIdentity, subjectPrivateKey

let subjectKeystore = myConfig.subjectKeystore
let subjectIdentity, subjectPrivateKey



/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function getSubjectIdentity() {
  try {
    log.info(`${moduleName}[${getSubjectIdentity.name}] -----> IN ...`)
    subjectPrivateKey = keythereum.recover(myConfig.addressPassword, identityKeystore)
    subjectIdentity = new UserIdentity(web3, `0x${identityKeystore.address}`, subjectPrivateKey)
    log.info(`${moduleName}[${getSubjectIdentity.name}] -----> Issuer Getted`)
    return subjectIdentity
  } catch (error) {
    log.error(`${moduleName}[${getSubjectIdentity.name}] -----> ${error}`)
    return error
  }
}

function getIssuerIdentity() {
  try {
    log.info(`${moduleName}[${getIssuerIdentity.name}] -----> IN ...`)
    identityPrivateKey = keythereum.recover(myConfig.addressPassword, issuerKeystore)
    issuerIdentity = new UserIdentity(web3, `0x${issuerKeystore.address}`, identityPrivateKey)
    log.info(`${moduleName}[${getIssuerIdentity.name}] -----> Issuer Getted`)
    return issuerIdentity
  } catch (error) {
    log.error(`${moduleName}[${getIssuerIdentity.name}] -----> ${error}`)
    return error
  }
}


function sendSigned(transactionSigned) {
  return new Promise((resolve, reject) => {
    log.info(`${moduleName}[${sendSigned.name}] -----> IN ...`)
    web3.eth.sendSignedTransaction(transactionSigned)
      .on('transactionHash', function (hash) {
        log.info(`${moduleName}[${sendSigned.name}] -----> HASH: ${hash} ...`)
      })
      .on('receipt', receipt => {
        resolve(receipt)
      })
      .on('error', error => {
        log.error(`${moduleName}[${sendSigned.name}] -----> ${error}`)
        reject(error)
      });

  })
}


function getKnownTransaction(entity, transaction) {
  return new Promise((resolve, reject) => {
    if(entity == 'issuer') {
      let issuerID = getIssuerIdentity()
      issuerID.getKnownTransaction(transaction)
      .then(trxIssuer => {
        resolve(trxIssuer)
      })
      .catch(error => {
        reject(error)
      })
    } else if(entity == 'subject') {
      let subjectID = getSubjectIdentity()
      subjectID.getKnownTransaction(transaction)
      .then(trxIssuer => {
        resolve(trxIssuer)
      })
      .catch(error => {
        reject(error)
      })
    }
  })
}

function preparedAlastriaId() {
  let preparedId = transactionFactory.identityManager.prepareAlastriaID(web3, identityKeystore.address)
  return preparedId
}

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  createAlastriaID,
  addIssuerCredential,
  getCurrentPublicKey
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function createAlastriaID(params) {
  return new Promise((resolve, reject) => {
    log.info(`${moduleName}[${createAlastriaID.name}] -----> IN ...`)
    log.info(`${moduleName}[${createAlastriaID.name}] -----> Calling addSubject credential With params: ${JSON.stringify(params)}`)

    let signedCreateTransaction = params.signedTX
    let preparedId = preparedAlastriaId()
    getKnownTransaction('issuer', preparedId)
    .then(signedPreparedTransaction => {
      sendSigned(signedPreparedTransaction)
      .then(prepareSendSigned => {
        sendSigned(signedCreateTransaction)
        .then(createSendSigned => {
          web3.eth.call({
            to: config.alastriaIdentityManager,
            data: web3.eth.abi.encodeFunctionCall(config.contractsAbi['AlastriaIdentityManager']['identityKeys'], [identityKeystore.address])
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
            log.error(`${moduleName}[${createAlastriaID.name}] -----> ${error}`)
            reject(error)
          })
        })
        .catch(error => {
          log.error(`${moduleName}[${createAlastriaID.name}] -----> ${error}`)
          reject(error)
        })
      })
      .catch(error => {
        log.error(`${moduleName}[${createAlastriaID.name}] -----> ${error}`)
        reject(error)
      })
    })
  })
}


function addIssuerCredential(params) {
      return new Promise((resolve, reject) => {
        log.debug(`${moduleName}[${addIssuerCredential.name}] -----> IN ...`)
        log.debug(`${moduleName}[${addIssuerCredential.name}] -----> Calling addIssuer credential With params: ${JSON.stringify(params)}`)
        let issuerCredential = transactionFactory.credentialRegistry.addIssuerCredential(web3, params.issuerCredentialHash)
        getKnownTransaction(issuerCredential)
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
                    log.debug(`${moduleName}[${addIssuerCredential.name}] -----> Success`)
                    resolve(credentialStatus)
                  }).catch(error => {
                    log.error(`${moduleName}[${addIssuerCredential.name}] -----> ${error}`)
                    reject(error)
                  })
              })
              .catch(error => {
                log.error(`${moduleName}[${addIssuerCredential.name}] -----> ${error}`)
                reject(error)
              })
          })
      })
      .catch(error => {
        log.error(`${moduleName}[${addSubjectCredential.name}] -----> ${error}`)
        reject(error)
      })
    })
  })
}

function getCurrentPublicKey(subject) {
  return new Promise((resolve, reject) => {
    log.info(`${moduleName}[${getCurrentPublicKey.name}] -----> IN ...`)
    let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject)
    log.info(`${moduleName}[${getCurrentPublicKey.name}] -----> calling web3 with params: ${subject}`)
    web3.eth.call(currentPubKey)
      .then(result => {
        log.info(`${moduleName}[${getCurrentPublicKey.name}] -----> Success`)
        let publicKey = web3.utils.hexToUtf8(result)
        resolve(publicKey.substr(1))
      })
      .catch(error => {
        log.error(`${moduleName}[${getCurrentPublicKey.name}] -----> ${error}`)
        reject(error)
      })
  })
}
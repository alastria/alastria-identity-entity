'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const Log = require('log')
const keythereum = require('keythereum')
const configHelper = require('../helpers/config.helper')
let myConfig = configHelper.getConfig()
const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const web3Helper = require('../helpers/web3.helper')
const moduleName = '[serviceProvider Model]'
const web3 = web3Helper.getWeb3()
const log = new Log(myConfig.Log.level)

let subjectKeystore = myConfig.identityKeystore
let issuerKeystore = myConfig.adminKeystore
let issuerIdentity, identityPrivateKey
let subjectKeystore = myConfig.subjectKeystore
let subjectIdentity, subjectPrivateKey

/////////////////////////////////////////////////////////
///////             PRIVATE FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function getSubjectIdentity() {
  try {
    log.debug(`${moduleName}[${getSubjectIdentity.name}] -----> IN ...`)
    subjectPrivateKey = keythereum.recover(myConfig.addressPassword, subjectKeystore)
    subjectIdentity = new UserIdentity(web3, `0x${subjectKeystore.address}`, subjectPrivateKey)
    log.debug(`${moduleName}[${getSubjectIdentity.name}] -----> Issuer Getted`)
    return subjectIdentity
  } catch (error) {
    log.error(`${moduleName}[${getSubjectIdentity.name}] -----> ${error}`)
    return error
  }
}

function getIssuerIdentity() {
  try {
    log.debug(`${moduleName}[${getIssuerIdentity.name}] -----> IN ...`)
    identityPrivateKey = keythereum.recover(myConfig.addressPassword, issuerKeystore)
    issuerIdentity = new UserIdentity(web3, `0x${issuerKeystore.address}`, identityPrivateKey)
    log.debug(`${moduleName}[${getIssuerIdentity.name}] -----> Issuer Getted`)
    return issuerIdentity
  } catch (error) {
    log.error(`${moduleName}[${getIssuerIdentity.name}] -----> ${error}`)
    return error
  }
}

function sendSigned(subjectCredentialSigned) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${sendSigned.name}] -----> IN ...`)
    console.log(subjectCredentialSigned)
    web3.eth.sendSignedTransaction(subjectCredentialSigned)
      .on('transactionHash', function (hash) {
        log.debug(`${moduleName}[${sendSigned.name}] -----> HASH: ${hash} ...`)
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
    } else if(entity == 'subject') {
      let subjectID = getSubjectIdentity()
      subjectID.getKnownTransaction(transaction)
      .then(trxIssuer => {
        resolve(trxIssuer)
      })
    }
  })
}

async function preparedAlastriaId() {
  let preparedId = await transactionFactory.identityManager.prepareAlastriaID(web3, subjectKeystore.address)
  return preparedId
}

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  createAlastriaID,
  addSubjectCredential,
  getCurrentPublicKey
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function createAlastriaID(params) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${createAlastriaID.name}] -----> IN ...`)
    log.debug(`${moduleName}[${createAlastriaID.name}] -----> Calling addSubject credential With params: ${JSON.stringify(params)}`)

    let preparedId = preparedAlastriaId()
    let signedPreparedTransaction = getKnownTransaction('issuer', preparedId)
    let signedCreateTransaction = params.signedTX
    sendSigned(signedPreparedTransaction)
    .then(prepareSendSigned => {
      console.log(prepareSendSigned)
      sendSigned(signedCreateTransaction)
      .then(createSendSigned => {
        console.log(createSendSigned)
        web3.eth.call({
          to: config.alastriaIdentityManager,
          data: web3.eth.abi.encodeFunctionCall(config.contractsAbi['AlastriaIdentityManager']['identityKeys'], [subjectKeystore.address])
        })
        .then(AlastriaIdentity => {
          configData.subject = `0x${AlastriaIdentity.slice(26)}`
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
}

function addSubjectCredential(params) {
      return new Promise((resolve, reject) => {
        log.debug(`${moduleName}[${addSubjectCredential.name}] -----> IN ...`)
        log.debug(`${moduleName}[${addSubjectCredential.name}] -----> Calling addSubject credential With params: ${JSON.stringify(params)}`)
        let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(web3, params.credentialHash, params.uri)
        getKnownTransaction('subject', subjectCredential)
          .then(subjectCredentialSigned => {
            sendSigned(subjectCredentialSigned)
              .then(receipt => {
                let subjectCredentialTransaction = transactionFactory.credentialRegistry.getSubjectCredentialStatus(web3, params.subject, params.credentialHash)
                web3.eth.call(subjectCredentialTransaction)
                  .then(SubjectCredentialStatus => {
                    let result = web3.eth.abi.decodeParameters(["bool", "uint8"], SubjectCredentialStatus)
                    let credentialStatus = {
                      "exists": result[0],
                      "status": result[1]
                    }
                    log.debug(`${moduleName}[${addSubjectCredential.name}] -----> Success`)
                    resolve(credentialStatus)
                  }).catch(error => {
                    log.error(`${moduleName}[${addSubjectCredential.name}] -----> ${error}`)
                    reject(error)
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
        log.debug(`${moduleName}[${getCurrentPublicKey.name}] -----> IN ...`)
        let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject)
        log.debug(`${moduleName}[${getCurrentPublicKey.name}] -----> calling web3 with params: ${subject}`)
        web3.eth.call(currentPubKey)
          .then(result => {
            log.debug(`${moduleName}[${getCurrentPublicKey.name}] -----> Success`)
            let publicKey = web3.utils.hexToUtf8(result)
            resolve(publicKey.substr(1))
          })
          .catch(error => {
            log.error(`${moduleName}[${getCurrentPublicKey.name}] -----> ${error}`)
            reject(error)
          })
      })
    }
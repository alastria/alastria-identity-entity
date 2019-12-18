'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const Log = require('log')
const keythereum = require('keythereum')
const configHelper = require('../helpers/config.helper')
const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const web3Helper = require('../helpers/web3.helper')
const moduleName = '[serviceProvider Model]'
const web3 = web3Helper.getWeb3()
const log = new Log('debug')

let myConfig = configHelper.getConfig()
let identityKeystore = myConfig.identityKeystore
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

function sendSigned(issuerCredentialSigned) {
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${sendSigned.name}] -----> IN ...`)
    web3.eth.sendSignedTransaction(issuerCredentialSigned)
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

function getKnownTransaction(issuerCredential) {
  return new Promise((resolve, reject) => {
    let issuerID = getSubjectIdentity()
    issuerID.getKnownTransaction(issuerCredential)
      .then(receipt => {
        resolve(receipt)
      })
  })
}

function preparedAlastriaId() {
  let preparedId = transactionFactory.identityManager.prepareAlastriaID(web3, subjectKeystore.address)
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
  console.log(params)
  return new Promise((resolve, reject) => {
    log.debug(`${moduleName}[${createAlastriaID.name}] -----> IN ...`)
    log.debug(`${moduleName}[${createAlastriaID.name}] -----> Calling addSubject credential With params: ${JSON.stringify(params)}`)

    preparedAlastriaId()
    let txCreateAlastriaID = transactionFactory.identityManager.createAlastriaIdentity(web3, params.rawPublicKey)
    let signedPreparedTransaction = issuerIdentity.getKnownTransaction(preparedId)
    let signedCreateTransaction = subjectIdentity.getKnownTransaction(txCreateAlastriaID)
    web3.eth.sendSignedTransaction(signedPreparedTransaction)
        .on('transactionHash', function (hash) {
          console.log("HASH: ", hash)
        })
        .on('receipt', function (receipt) {
          console.log("RECEIPT: ", receipt)
          web3.eth.sendSignedTransaction(signedCreateTransaction)
            .on('transactionHash', function (hash) {
              console.log("HASH: ", hash)
            })
            .on('receipt', function (receipt) {
              console.log("RECEIPT: ", receipt)
              web3.eth.call({
                to: config.alastriaIdentityManager,
                data: web3.eth.abi.encodeFunctionCall(config.contractsAbi['AlastriaIdentityManager']['identityKeys'], [subjectKeystore.address])
              })
                .then(AlastriaIdentity => {
                  console.log(`alastriaProxyAddress: 0x${AlastriaIdentity.slice(26)}`)
                  configData.subject = `0x${AlastriaIdentity.slice(26)}`
                  fs.writeFileSync('../configuration.json', JSON.stringify(configData))
                  let alastriaDID = tokensFactory.tokens.createDID('quor', AlastriaIdentity.slice(26));
                  console.log('the alastria DID is:', alastriaDID)
                })
            })
            .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
        })
        .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
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
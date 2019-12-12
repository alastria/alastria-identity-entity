'use strict';

const Log = require('log')
const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const web3Helper = require('../helpers/web3.helper')
const moduleName = '[serviceProvider Model]'

const web3 = web3Helper.getWeb3()

module.exports = {
  createAlastriaID,
  addSubjectCredential,
  getCurrentPublicKey
}

const log = new Log('debug')

function createAlastriaID() {
  return new Promise((resolve, reject) => {
    // put here your code
  })
}

function addSubjectCredential(params) {
  return new Promise((resolve, reject) => {
    // put here your code
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
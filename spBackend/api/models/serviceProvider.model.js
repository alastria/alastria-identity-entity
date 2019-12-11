'use strict';

const Log = require('log')
const { transactionFactory, UserIdentity, config, tokensFactory } = require('alastria-identity-lib')
const web3Helper = require('../helpers/web3.helper')

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

function addSubjectCredential() {
  return new Promise((resolve, reject) => {
    // put here your code
  })
}

function getCurrentPublicKey() {
  return new Promise((resolve, reject) => {
    let subject = 0x57d2fc4a9818c81c2b5dedf60c32aaadbbbdd109 // TODO borrar
    let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject)
    web3.eth.call(currentPubKey)
      .then(result => {
        let publicKey = web3.utils.hexToUtf8(result)
        console.log('RESULT ----->', publicKey.substr(1))
        resolve(publicKey.substr(1))
      })
      .catch(error => {
        console.log('Error -------->', error)
        reject(error)
      })
  })
}
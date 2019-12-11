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

function getCurrentPublicKey(subject) {
  return new Promise((resolve, reject) => {
    let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subject)
    web3.eth.call(currentPubKey)
    .then(result => {
      let publicKey = web3.utils.hexToUtf8(result)
      resolve(publicKey.substr(1))
    })
    .catch(error => {
      console.log('Error -------->', error)
      reject(error)
    })
  })
}
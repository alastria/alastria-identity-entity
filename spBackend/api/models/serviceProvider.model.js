'use strict';

const Log = require('log')
const {transactionFactory, UserIdentity, config, tokensFactory} = require('alastria-identity-lib')
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
    // put here your code
  })
}
'use strict';

const Log = require('log')
const {transactionFactory, UserIdentity, config, tokensFactory} = require('alastria-identity-lib')
const web3Helper = require('../helpers/web3.helper')

const web3 = web3Helper.getWeb3()
const keythereum = require('keythereum')
const Web3 = require('web3')

let ganacheNode = "http://127.0.0.1:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheNode))
let subjectProxyAddress = "0xd7aa62f167c53f6c4ad9525f8be147a6eec9a58e";

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
    if(configData.subject == undefined) {
      console.log('You must create an Alastria ID')
      process.exit()
    }
  
  let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, subjectProxyAddress)
  
  web3.eth.call(currentPubKey)
  .then(result => {
    let publicKey = web3.utils.hexToUtf8(result)
    console.log('RESULT ----->', publicKey.substr(1))
  })
  .catch(error => {
    console.log('Error -------->', error)
  })
  })
}
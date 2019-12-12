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

function addSubjectCredential(json) {
  return new Promise((resolve, reject) => {
    // console.log("JSON -------->",json)
    // let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(web3, credentialHash, uri)
    // let subjectCredentialSigned =  issuerIdentity.getKnownTransaction(subjectCredential)
    // web3.eth.sendSignedTransaction(subjectCredentialSigned)
    // .then(receipt => {
    //   let subjectCredentialTransaction = transactionFactory.credentialRegistry.getSubjectCredentialStatus(web3, subject, credentialHash)
		// 		web3.eth.call(subjectCredentialTransaction)
		// 		.then(SubjectCredentialStatus => {
		// 			let result = web3.eth.abi.decodeParameters(["bool","uint8"],SubjectCredentialStatus)
		// 			let credentialStatus = { 
		// 				"exists": result[0],
		// 				"status":result[1]
    //       }
    //       console.log("CREDENTIAL -------->",credentialStatus)
    //       resolve(credentialStatus)
    //     }).catch(error => {
    //       console.log('Error -------->', error)
    //       reject(error)
    //     })
    //   })
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
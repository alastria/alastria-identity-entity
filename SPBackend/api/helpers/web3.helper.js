// web3.helper.js

const Log = require('log')
const Web3 = require('web3')
const helper_name = '[Web3 Helper]'

const log = new Log('debug')

module.exports = {
  instanceWeb3,
  setWeb3,
  getWeb3
}

let myWeb3 = {}

function setWeb3(web3) {
  myWeb3 = web3
}

function getWeb3() {
  return myWeb3
}

function instanceWeb3(nodeUrl) {
  return new Promise((resolve, reject) => {
    try {
      log.debug(`${helper_name}${instanceWeb3.name} -----> Instantiating Web3 ...`)
      myWeb3 = new Web3(new Web3.providers.HttpProvider(nodeUrl))
      resolve(myWeb3)
    }
    catch(error) {
      log.error(`${helper_name}${instanceWeb3.name} -----> Error: ${error}`)
    }
  })
}
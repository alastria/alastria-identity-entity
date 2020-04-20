'use strict';

/////////////////////////////////////////////////////////
///////                 constants                 ///////
/////////////////////////////////////////////////////////

const jwt = require('jsonwebtoken')
const http = require('http')
const axios = require('axios')
const configHelper = require('../helpers/config.helper')
const myConfig = configHelper.getConfig()
const Log = require('log4js')
const log = Log.getLogger()
log.level = myConfig.Log.level
const helper_name = 'Utils Helper'

/////////////////////////////////////////////////////////
///////               MODULE EXPORTS              ///////
/////////////////////////////////////////////////////////

module.exports = {
  getKeyManager,
  verifyJWT
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

async function getKeyManager(keymanager) {
  try {
    log.info(`${helper_name}[${getKeyManager.name}] -----> IN ...`)
    let httpAgent = new http.Agent({
      rejectUnauthorized: false
    })
    let myKey = await axios.get(keymanager, { httpAgent })
    if(!myKey) {
      let error = 'Cannot get Key'
      log.error(`${helper_name}[${getKeyManager.name}] -----> ${error}`)
      throw error
    }
    let publicKey = ['-----BEGIN PUBLIC KEY-----', myKey.data.key, '-----END PUBLIC KEY-----'].join('\n')
    log.info(`${helper_name}[${getKeyManager.name}] -----> Public Key Getted`)
    return publicKey
  }
  catch(error) {
    log.error(`${helper_name}[${getKeyManager.name}] -----> ${error}`)
    throw error
  }
}


async function verifyJWT(tokenJWT, publicKey) {
  try {
    log.info(`${helper_name}[${verifyJWT.name}] -----> IN ...`)
    let options = {
      ignoreNotBefore: true
    }
    tokenJWT = tokenJWT.replace(/Bearer /g, '')
    jwt.verify(tokenJWT, publicKey, options, (err, decoded) => {
      if(err){
        log.error(`${helper_name}[${verifyJWT.name}] -----> ${err}`)
        throw err
      } else {
        log.info(`${helper_name}[${verifyJWT.name}] -----> Token decoded`)
        return decoded
      }
    })
  }
  catch(error) {
    log.error(`${helper_name}[${verifyJWT.name}] -----> ${error}`)
    throw error
  }
}
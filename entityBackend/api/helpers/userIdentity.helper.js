// tokens.helper.js

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const { UserIdentity } = require('alastria-identity-lib')
const helper_name = '[UserIdentity Helper]'
const Log = require('log4js')
const log = Log.getLogger()

/////////////////////////////////////////////////////////
///////              MODULE EXPORTS               ///////
/////////////////////////////////////////////////////////

module.exports = {
  getUserIdentity
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

async function getUserIdentity(web3, address, privateKey) {
  try {
    log.info(`${helper_name}[${getUserIdentity.name}] -----> IN ...`)
    issuerIdentity = await new UserIdentity(web3, address, privateKey)
    log.info(`${helper_name}[${getUserIdentity.name}] -----> Issuer Getted`)
    return issuerIdentity
  } catch (error) {
    log.error(`${helper_name}[${getUserIdentity.name}] -----> ${error}`)
    throw error
  }
}

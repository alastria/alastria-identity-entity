// config.helper.js

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const Log = require('log4js')
const helper_name = '[Config Helper]'
const log = Log.getLogger()

/////////////////////////////////////////////////////////
///////              MODULE EXPORTS               ///////
/////////////////////////////////////////////////////////

module.exports = {
  setConfig,
  getConfig
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

let myConfig = {}

function setConfig(config) {
  log.debug(`${helper_name}[${setConfig.name}] -----> Seting obtained config ...`)
  myConfig = config
}

function getConfig() {
  return myConfig
}

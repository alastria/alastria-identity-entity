// config.helper.js

const Log = require('log4js')
const helper_name = '[Config Helper]'

const log = Log.getLogger()

module.exports = {
  setConfig,
  getConfig
}

let myConfig = {}

function setConfig(config) {
  log.debug(`${helper_name}[${setConfig.name}] -----> Seting obtained config ...`)
  myConfig = config
}

function getConfig() {
  return myConfig
}

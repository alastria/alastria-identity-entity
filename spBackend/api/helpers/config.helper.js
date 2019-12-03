// config.helper.js

const Log = require('log')
const helper_name = '[Config Helper]'

const log = new Log('debug')

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
  log.debug(`${helper_name}[${getConfig.name}] -----> Getting config: ${JSON.stringify(myConfig)}`)
  return myConfig
}

'use strict';

var SwaggerExpress = require('swagger-express-mw');
const Log = require('log4js')
const web3Helper = require('./api/helpers/web3.helper')
const configHelper = require('./api/helpers/config.helper')
const loadJsonFile = require('load-json-file')
const cors = require('cors')
const pathFile = 'config.json'
const log = Log.getLogger()
log.level = 'debug'


let app = require('express')();
let myConfig = {}
let nodeurl = ''

module.exports = app; // for testing

loadJsonFile(pathFile) 
.then(config => {
  configHelper.setConfig(config)
  myConfig = configHelper.getConfig()
  log.info(`[App] -----> Congif getted ${JSON.stringify(myConfig)}`)

  if(!process.env.NODE_ENDPOINT) {
    nodeurl = myConfig.nodeUrl.alastria // change to local or alastria when yo are developing (swagger project start)
  } else if(process.env.NODE_ENDPOINT == 'localEndpoint') {
    nodeurl = myConfig.nodeUrl.local
  } else if(process.env.NODE_ENDPOINT == 'alastria') {
    nodeurl = myConfig.nodeUrl.alastria
  }
  log.info(`[App] -----> Connected via RPC to ${nodeurl}`)
  
  web3Helper.instanceWeb3(nodeurl)
  .then(web3Instantiated => {

    var config = {
      appRoot: __dirname // required config
    };
  
    log.info('[App] -----> Web3 instantiated correctly')
    web3Helper.setWeb3(web3Instantiated)
    
    SwaggerExpress.create(config, function(err, swaggerExpress) {
      if (err) { throw err; }
    
      // install middleware
      swaggerExpress.register(app);
    
      var port = process.env.PORT || 10010;
      app.listen(port);
  
      // Enable CORS
      app.use(cors());
  
    });
  })
})
.catch(error => {
  log.error(`${error}`)
})


'use strict';

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const web3Helper = require('./api/helpers/web3.helper')
const configHelper = require('./api/helpers/config.helper')
const wsHelper = require('./api/helpers/ws.helper')
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const Log = require('log4js')
const loadJsonFile = require('load-json-file')
const cors = require('cors')
const io = require('socket.io')()
const pathFile = 'config.json'
const log = Log.getLogger()

const configHost = process.env.CONFIG_HOST
const configPath = process.env.CONFIG_PATH

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

let myConfig = {}
let nodeurl, keyManagerUrl

// module.exports = app; // for testing


loadJsonFile(pathFile) 
.then(config => {
  configHelper.setConfig(config)
  myConfig = configHelper.getConfig()
  log.level = myConfig.Log.level
  const utils = require('./api/helpers/utils.helper')
  log.debug(`[App] -----> Congif getted ${JSON.stringify(myConfig)}`)
 
  nodeurl = myConfig.nodeUrl.alastria
  log.info(`[App] -----> Connected via RPC to ${nodeurl}`)
  
  web3Helper.instanceWeb3(nodeurl)
  .then(web3Instantiated => {
    
    const server = myConfig.socketPort
    io.attach(server)

    io.on('connect', socket => {
      log.info(`[App] -----> Websocket attached!`)
      socket.on('createIdentityWs', message => {
        io.emit('createIdentityWs', message)
	      log.info(`[App] -----> Message: ${JSON.stringify(message)}`)
      })
    })
    
    wsHelper.setWSObject(io)

    var config = {
      appRoot: __dirname // required config
    };
  
    log.info('[App] -----> Web3 instantiated correctly')
    web3Helper.setWeb3(web3Instantiated)
    
    SwaggerExpress.create(config, function(err, swaggerExpress) {
      if (err) { throw err; }
    
      
      var port = process.env.PORT || 10010;
      app.listen(port, function(){
        log.info(`[App] -----> Server started in http://localhost:${port}`)
      });
      
      // Enable CORS
      app.use(cors());
      
      // Auth
      app.all('*', (req, res, next) => {
        let tokenJWT = req.headers['authorization']
        keyManagerUrl = myConfig.keyManagerUrl
        if(!tokenJWT) {
          let error = 'It is necessary to provide an authentication token'
          log.error(`[App] -----> ${error}`)
          res.status(401).send(`Error: ${error}`)
        } else {
          // if(keyManagerUrl == '') {
          //   let error = 'It is necessary to provide a key manager URL'
          //   log.error(`[App] -----> ${error}`)
          //   res.status(404).send(`Error: ${error}`)
          // } else {
            // utils.getKeyManager(keyManagerUrl)
            // .then(publicKey => {
              let publicKey = myConfig.authKeyToken   // Remove when keymanager works
              utils.verifyJWT(tokenJWT, publicKey)
              .then(validated => {
                log.info(`[App] -----> Server started in http://localhost:${port}`)
                next()
              })
            // })
          }
        // }
      })
      
      // install middleware
      swaggerExpress.register(app);
    });
  })
})
.catch(error => {
  log.error(`${error}`)
})


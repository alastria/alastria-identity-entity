'use strict';

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const web3Helper = require('./api/helpers/web3.helper')
const configHelper = require('./api/helpers/config.helper')
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const Log = require('log4js')
const loadJsonFile = require('load-json-file')
const cors = require('cors')
const io = require('socket.io')()
const pathFile = 'config.json'
const log = Log.getLogger()
const wsHelper = require('./api/helpers/ws.helper')

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

let myConfig = {}
let nodeurl = ''

// module.exports = app; // for testing


loadJsonFile(pathFile) 
.then(config => {
  configHelper.setConfig(config)
  myConfig = configHelper.getConfig()
  log.level = myConfig.Log.level
  log.debug(`[App] -----> Congif getted ${JSON.stringify(myConfig)}`)
  
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
    
    const server = myConfig.socketPort
    io.attach(server)

    // io.on('connect', (socket) => {
    //   log.info(`[App] -----> Websocket ${socket.id} attached`)
    // })
    const CLIENTS = []

    io.on('connect', ws => {
      CLIENTS.push(ws)
      ws.on('message', message => {
        log.info(`[App] -----> Received %s ${message}`)
      })
      ws.on('createIdentityWs', message => {
        io.emit('createIdentityWs', message)
	      log.info(`[App] -----> Message: ${JSON.stringify(message)}`)
      })
      log.info(`[App] -----> Websocket attached!`)
      ws.send('NEW USER JOINED')
    })

    wsHelper.setWSObject(io)

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
      app.listen(port, function(){
        log.info(`[App] -----> Server started in http://localhost:${port}`)
      });
  
      // Enable CORS
      app.use(cors());
  
    });
  })
})
.catch(error => {
  log.error(`${error}`)
})


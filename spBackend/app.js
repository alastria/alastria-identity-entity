'use strict';

var SwaggerExpress = require('swagger-express-mw');
const Log = require('log')
const web3Helper = require('./api/helpers/web3.helper')
const cors = require('cors')
var app = require('express')();

const nodeurl = 'http://localhost:8545'
const log = new Log('debug')


module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

web3Helper.instanceWeb3(nodeurl)
.then(web3Instantiated => {

  log.debug('[App] Web3 instantiated correctly')
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


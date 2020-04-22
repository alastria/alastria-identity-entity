// tokens.helper.js

/////////////////////////////////////////////////////////
///////                 CONSTANTS                 ///////
/////////////////////////////////////////////////////////

const { tokensFactory } = require('alastria-identity-lib')
const helper_name = '[Token Helper]'
const Log = require('log4js')
const log = Log.getLogger()

/////////////////////////////////////////////////////////
///////              MODULE EXPORTS               ///////
/////////////////////////////////////////////////////////

module.exports = {
  decodeJWT,
  verifyJWT,
  signJWT,
  createAlastriaToken,
  createCredential,
  createPresentationRequest,
  psmHash,
  createDID
}

/////////////////////////////////////////////////////////
///////              PUBLIC FUNCTIONS             ///////
/////////////////////////////////////////////////////////

function decodeJWT(tokenJWT) {
  try {
    let decode = tokensFactory.tokens.decodeJWT(tokenJWT)
    log.info(`${helper_name}[${decodeJWT.name}] -----> Token Decoded`)
    return decode
  }
  catch (error) {
    log.error(`${helper_name}[${decodeJWT.name}] -----> ${error}`)
    throw error
  }
}

function verifyJWT(tokenJWT, publicKey) {
  try {
    let verify = tokensFactory.tokens.verifyJWT(tokenJWT, `04${publicKey}`)
    log.info(`${helper_name}[${verifyJWT.name}] -----> Token Verified`)
    return verify
  }
  catch (error) {
    log.error(`${helper_name}[${verifyJWT.name}] -----> ${error}`)
    throw error
  }
}

 function signJWT(object, privateKey) {
  try {
    let verify = tokensFactory.tokens.signJWT(object, privateKey)
    log.info(`${helper_name}[${signJWT.name}] -----> Token Signed`)
    return verify
  }
  catch (error) {
    log.error(`${helper_name}[${signJWT.name}] -----> ${error}`)
    throw error
  }
}

function createAlastriaToken(tokenData) {
  try {
    let alastriaToken = tokensFactory.tokens.createAlastriaToken(tokenData.iss, tokenData.gwu, tokenData.cbu,
      tokenData.ani, tokenData.exp, tokenData.nbf, 
      tokenData.jti)
    log.info(`${helper_name}[${createAlastriaToken.name}] -----> Created Alastria Token`)
    return alastriaToken
  }
  catch (error) {
    log.error(`${helper_name}[${createAlastriaToken.name}] -----> ${error}`)
    throw error
  }
}

 function createCredential(kid, iss, sub, contect, credentialSubject, exp, nbf, jti) {
  try {
    let credential =  tokensFactory.tokens.createCredential(`${kid}#keys-1`, iss, sub, contect, credentialSubject, exp, nbf, jti)
    log.info(`${helper_name}[${createCredential.name}] -----> Created Credential`)
    return credential
  }
  catch (error) {
    log.error(`${helper_name}[${createCredential.name}] -----> ${error}`)
    throw error
  }
}

function createPresentationRequest(kid, iss, context, procUrl, procHash, data, exp, nbf, jti) {
  try {
    let credential = tokensFactory.tokens.createPresentationRequest(`${kid}#keys-1`, iss, context, procUrl, procHash, data, exp, nbf, jti)
    log.info(`${helper_name}[${createPresentationRequest.name}] -----> Created Presentation Reques`)
    return credential
  }
  catch (error) {
    log.error(`${helper_name}[${createPresentationRequest.name}] -----> ${error}`)
    throw error
  }
}

function psmHash(web3, jwt, did) {
  try {
    let psmHash = tokensFactory.tokens.PSMHash(web3, jwt, did)
    log.info(`${helper_name}[${psmHash.name}] -----> Created PSMHash`)
    return psmHash
  }
  catch (error) {
    log.error(`${helper_name}[${psmHash.name}] -----> ${error}`)
    throw error
  }
}

function createDID(createAlastriaTX, alastriaToken, publicKey) {
  try {
    let did = tokensFactory.tokens.createDID(createAlastriaTX, alastriaToken, publicKey)
    log.info(`${helper_name}[${createDID.name}] -----> Created DID`)
    return did
  }
  catch (error) {
    log.error(`${helper_name}[${createDID.name}] -----> ${error}`)
    throw error
  }
}

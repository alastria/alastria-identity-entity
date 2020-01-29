import { Injectable } from '@angular/core';
import { tokensFactory } from 'alastria-identity-lib';

@Injectable({
  providedIn: 'root'
})
export class AlastriaLibService {

  constructor() { }

  createPresentationRequest(header: any, payload: any) {
    return tokensFactory.tokens.createPresentationRequest(
      header.kid, payload.iss, payload.pr['@context'], payload.pr.procUrl, payload.pr.procHash, payload.pr.data, payload.nbf, payload.jti
    );
  }

  signJWT(jwt: any, privateKey: any) {
    return tokensFactory.tokens.signJWT(jwt, privateKey);
  }

  createAlastriaToken(config: any) {
    return tokensFactory.tokens.createAlastriaToken(config.did, config.providerUrl, config.callbackUrl,
      config.alastriaNetId, config.tokenExpTime, config.tokenActivationDate, config.jsonTokenId);
  }
}

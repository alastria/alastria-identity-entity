import { Injectable } from '@angular/core';
import { tokensFactory } from 'alastria-identity-lib';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlastriaLibService {

  constructor() { }

  createPresentationRequest(header: any, payload: any) {
    const procUrl = `${environment.apiUrl}/${payload.pr.procUrl}`;

    return tokensFactory.tokens.createPresentationRequest(
      header.kid, payload.iss, payload.pr['@context'], procUrl, payload.pr.procHash, payload.pr.data, payload.nbf, payload.jti
    );
  }

  signJWT(jwt: any, privateKey: any) {
    return tokensFactory.tokens.signJWT(jwt, privateKey);
  }

  createAlastriaToken(config: any) {
    return tokensFactory.tokens.createAlastriaToken(config.did, config.providerUrl, config.callbackUrl,
      config.alastriaNetId, config.tokenExpTime, config.tokenActivationDate, config.jsonTokenId);
  }

  createCredential(header: any, payload: any) {
    return tokensFactory.tokens.createCredential(
      header.kid, payload.iss, payload.sub, payload.pr['@context'], payload.credentialSubject, payload.exp, payload.nbf, payload.jti
    );
  }
}

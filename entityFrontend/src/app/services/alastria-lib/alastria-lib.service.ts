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

  signPresentationRequest(presentationRequest: any, key: any) {
    return tokensFactory.tokens.signJWT(presentationRequest, key);
  }
}

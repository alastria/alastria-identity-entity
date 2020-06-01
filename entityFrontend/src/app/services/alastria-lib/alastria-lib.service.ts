import { Injectable } from '@angular/core';
import { tokensFactory } from 'alastria-identity-lib';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlastriaLibService {

  constructor() { }

  signJWT(jwt: any, privateKey: any) {
    return tokensFactory.tokens.signJWT(jwt, privateKey);
  }
}

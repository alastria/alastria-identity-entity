import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

// Models
import { Identity } from 'src/app/models/identity/identity.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  auth = environment.authToken
  apiUrl = environment.apiUrl;
  path = 'entity';

  constructor(private http: HttpClient) { }

  /**
   * Function for create Alastria Token from service
   * @returns {*}
   */
  createAlastriaToken(functionCall): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth,
        'functionCall': functionCall
      })
    };
    return this.http.post(`${this.apiUrl}/${this.path}/alastria/alastriaToken`, null, httpOptions).toPromise()
      .then((res: any) => res.AT)
      .catch((error: any) => {
        throw error;
      });
  }

    /**
   * Function for create Alastria Credentials from service
   * @returns {*}
   */
  createCredentialsToken(credentials, subjectDID): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.post(`${this.apiUrl}/${this.path}/alastria/credential?identityDID=${subjectDID}`, credentials, httpOptions).toPromise()
      .then((res: any) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  /**
  * Function for create Alastria Presentation Requet from service
  * @returns {*}
  */
  createPresentationRequest(presentationRequest: any): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.post(`${this.apiUrl}/${this.path}/alastria/presentationRequest`, presentationRequest, httpOptions).toPromise()
      .then((res: any) => res.jwt)
      .catch((error: any) => {
        throw error;
      });
  }

  /**
   * Function for create identity calling at the server
   * @param identity - data of identity for create a new identity
   * @returns {*}
   */
  createIdentity(identity: Identity): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.post(`${this.apiUrl}/${this.path}/identity`, identity, httpOptions).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  /**
   * Function for create subject credential calling at the server
   * @param signedTX - hash of the signed transaction
   * @returns {*}
   */
  createSubjectCredential(signedTX: string): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    const body = {
      signedTX
    };
    return this.http.post(`${this.apiUrl}/${this.path}/credential`, body, httpOptions).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  /**
   * @param alastriaId - identifier of alastria for get public key
   * @returns {*}
   */
  getPublicKey(alastriaId: string): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.get(`${this.apiUrl}/${this.path}/identity/${alastriaId}`, httpOptions).toPromise()
      .then((res) => {
        console.log('res --> ', res);
        return res;
      })
      .catch((error: any) => {
        throw error;
      });
  }
}

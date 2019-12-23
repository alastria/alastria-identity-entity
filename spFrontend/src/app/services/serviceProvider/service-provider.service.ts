import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Models
import { Identity } from 'src/app/models/identity/identity.model';

import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Function for create identity calling at the server
   * @param identity - data of identity for create a new identity
   * @returns {*}
   */
  createIdentity(identity: Identity): any {
    return this.http.post(`${this.apiUrl}/serviceProvider/alastriaId`, identity).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        // throw error;
        // MOCK
        return {
          status: 200
        };
      });
  }

  /**
   * Function for create subject credential calling at the server
   * @param signedTX - hash of the signed transaction
   * @returns {*}
   */
  createSubjectCredential(signedTX: string): any {
    const body = {
      signedTX
    };

    return this.http.post(`${this.apiUrl}//serviceProvider/issuerCredential`, body).toPromise()
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
    return this.http.get(`${this.apiUrl}//serviceProvider/${alastriaId}`).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }
}

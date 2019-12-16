import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Models
import { Identity } from 'src/app/models/identity/identity.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  constructor(private http: HttpClient) { }

  createIdentity(identity: Identity): any {
    return this.http.post('http://localhost:10010/serviceProvider/alastriaId', identity).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        // throw error;
        // MOCK
        return {
          status: 200
        };
      });
  }

  createSubjectCredential(signedTX: string): any {
    const body = {
      signedTX
    };

    return this.http.post('http://localhost:10010/serviceProvider/subjectCredential', body).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  getPublicKey(alastriaId: string): any {
    return this.http.get(`http://localhost:10010/serviceProvider/${alastriaId}`).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }
}

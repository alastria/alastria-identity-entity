import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

// MODELS
import { User } from 'src/app/models/user/user.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth = environment.authToken;
  isAlastriaIdVerified: boolean;
  apiUrl = environment.apiUrl;
  path = 'entity';

  constructor(private http: HttpClient) { }

  /**
   * @param user - data of user for login in the aplication
   * @returns message correct or incorrect login
   */

  async login(user: any): Promise<any> {
    const username = (user.email) ? user.email : user.username;
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.auth
        })
      };
      const result: any = await this.http.get(`${this.apiUrl}/${this.path}/login?username=${username}&password=${user.password}`, httpOptions).toPromise();
      if (result.authToken) {
        const userStorage: User = result.userData;
        userStorage.authToken = result.authToken;

        return userStorage;
      }
    } catch (error) {
      console.log('error ', error);
      throw error;
    }
  }


  createUser(user: User): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.post(`${this.apiUrl}/${this.path}/user`, user, httpOptions).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  updateUser(user: User): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.put(`${this.apiUrl}/${this.path}/user?id=${user.id}`, user, httpOptions).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  updatePassword(user: any): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth
      })
    };
    return this.http.put(`${this.apiUrl}/${this.path}/user?id=${user.id}`, user, httpOptions).toPromise()
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  /**
   * Get data of user
   * @returns user
   */
  getUserLoggedIn(): User {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  /**
   * set data of user in sessionStorage
   * @param user - data of user
   */
  setUserLoggedIn(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Get isAlastriaIdVerified
   * @returns boolean
   */
  getIsAlastriaIdVerified(): boolean {
    return this.isAlastriaIdVerified;
  }

  /**
   * set isAlastriaIdVerified
   * @param isAlastriaIdVerified - true or false
   */
  setIsAlastriaIdVerified(isAlastriaIdVerified: boolean): void {
    this.isAlastriaIdVerified = isAlastriaIdVerified;
  }

  /**
   * Get userVinculate
   * @returns string
   */
  getUserVinculate(): any {
    return JSON.parse(sessionStorage.getItem('userVinculate'));
  }

  /**
   * set userVinculate in session storage
   * @param userVinculate - userVinculate for vinculate user
   */
  setUserVinculate(userVinculate: string): void {
    sessionStorage.setItem('userVinculate', JSON.stringify(userVinculate));
  }
}



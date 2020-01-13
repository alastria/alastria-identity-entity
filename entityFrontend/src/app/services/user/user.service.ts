import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { User } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isAlastriaIdVerified: boolean;

  constructor(private http: HttpClient) { }

  /**
   * @param user - data of user for login in the aplication
   * @returns message correct or incorrect login
   */
  async login(user: User): Promise<any> {
    try {
      const authUrl = '../../../assets/auth.json';
      let isLogin = false;
      const authCredentials: any = await this.http.get(authUrl).toPromise();

      if ((user.name === authCredentials.name || user.name === authCredentials.email || user.email === authCredentials.email)
          && user.password === authCredentials.password) {
        isLogin = true;
      } else {
        const error = {
          message: 'incorrect username or password',
          status: 403
        };

        throw error;
      }

      authCredentials.isAuthenticated = isLogin;
      delete authCredentials.password;

      return authCredentials;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns - true or false id the user is authenticated
   */
  isAuthenticated(): boolean {
    const currentUser = this.getUserLoggedIn();

    return (currentUser && currentUser.isAuthenticated) ? currentUser.isAuthenticated : false;
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
}



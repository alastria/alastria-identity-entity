import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { UserLogin } from 'src/app/models/userLogin/userLogin.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * @param user - data of user for login in the aplication
   * @returns message correct or incorrect login
   */
  async login(user: UserLogin): Promise<any> {
    try {
      const authUrl = '../../../assets/auth.json';
      let isLogin = false;

      const authCredentials: any = await this.http.get(authUrl).toPromise();

      if (user.name === authCredentials.name && user.password === authCredentials.password) {
        isLogin = true;
      } else {
        const error = {
          message: 'incorrect username or password',
          status: 403
        };

        throw error;
      }

      user.email = authCredentials.email;
      user.isAuthenticated = true;
      this.setUserLoggedIn(user);

      return isLogin;
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
  getUserLoggedIn(): UserLogin {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  /**
   * set data of user in sessionStorage
   * @param user - data of user
   */
  setUserLoggedIn(user: UserLogin): void {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }



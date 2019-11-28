import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { UserLogin } from 'src/app/models/userLogin/userLogin.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  async login(user: UserLogin): Promise<any> {
    try {
      const authUrl = '../../../assets/auth.json';
      let isLogin = false;

      const authCredentials = await this.http.get(authUrl).toPromise();

      if (JSON.stringify(user) === JSON.stringify(authCredentials)) {
        isLogin = true;
      } else {
        const error = {
          message: 'incorrect username or password',
          status: 403
        };

        throw error;
      }
      user.isAuthenticated = true;
      this.setUserLoggedIn(user);

      return isLogin;
    } catch (error) {

      throw error;
    }
  }

  isAuthenticated(): boolean {
    const currentUser = this.getUserLoggedIn();

    return (currentUser && currentUser.isAuthenticated) ? currentUser.isAuthenticated : false;
  }

  getUserLoggedIn(): UserLogin {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  setUserLoggedIn(user: UserLogin): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }
}



import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthGuardService {
  apiUrl = environment.apiUrl;
  path = 'entity';

  constructor(private userService: UserService,
              private router: Router,
              private http: HttpClient) { }


  /**
   * Function for activate access to a url (custodian)
   * @returns Promise or boolean
   */
  async canActivate(): Promise<any> {
    const user = this.userService.getUserLoggedIn();
    const authToken = (user && user.authToken) ? user.authToken : 'dfdsf';
    try {
      const result: any = await this.http.get(`${this.apiUrl}/${this.path}/user/checkAuth?authToken=${authToken}`).toPromise();
      if (result.status) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.log('Error ', error);
      this.router.navigate(['/login']);
      return false;
    }

  }
}

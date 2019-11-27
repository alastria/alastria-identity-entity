import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

@Injectable()
export class AuthGuardService {

  constructor(private userService: UserService,
              private router: Router) { }

  /**
   * Function for activate access to a url (custodian)
   * @returns Promise or boolean
   */
  async canActivate(): Promise<any> {

    try {
      const isAuthenticated = await this.userService.isAuthenticated();
      if (isAuthenticated) {
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

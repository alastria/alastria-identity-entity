import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user/user.model';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  errorLogin: string;
  styleButtonFacebook = {
    color: '#5C7DC2',
    backgroundIcon: '#45619D',
    colorIcon: 'white'
  };
  styleButtonGoogle = {
    color: '#4081ED',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };
  styleButtonAlastriaId = {
    color: '#00CAD6',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };


  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: UserService) { }

  ngOnInit() {
    sessionStorage.clear();

    this.formLogin = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Function for submit login
   */
  async onSubmit(): Promise<any> {

    try {
      this.errorLogin = '';
      const user: User = {
        name: this.formLogin.get('name').value,
        password: this.formLogin.get('password').value
      };

      const userLogin = await this.userService.login(user);

      this.userService.setUserLoggedIn(userLogin);
      this.router.navigate(['/', 'profile']);
    } catch (error) {
      console.log('Error ', error);
      if (error && error.status === 403) {
        this.errorLogin = 'Usuario o contraseña incorrectos';
      } else {
        this.errorLogin = (error && error.message) ? error.message : 'Internal server error';
      }
    }

  }

  /**
   * Function that handle if click in any social button
   * @param socialName - type social (facebook, google or alastriaId)
   */
  handleLoginSocial(socialName: string): void {

    if (socialName === 'alastriaId') {
      $('#myModal').modal('show');
    } else {
      console.log(socialName);
    }

  }

  /**
   * Function handle when click ok in modal simple
   */
  async handleOk(): Promise<any> {

    try {
      const user: User = {
        name: 'Samuel',
        password: 'test'
      };
      const userLogin = await this.userService.login(user);

      this.userService.setUserLoggedIn(userLogin);
      $('#myModal').modal('hide');
      this.router.navigate(['/', 'profile']);
    } catch (error) {
      console.log('Error ', error);
      if (error && error.status === 403) {
        this.errorLogin = 'Usuario o contraseña incorrectos';
      } else {
        this.errorLogin = (error && error.message) ? error.message : 'Internal server error';
      }
    }
  }

  goToHome(): void {

    this.router.navigate(['/', 'home']);

  }
}

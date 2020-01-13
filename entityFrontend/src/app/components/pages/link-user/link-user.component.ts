import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

// MODELS
import { User } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-link-user',
  templateUrl: './link-user.component.html',
  styleUrls: ['./link-user.component.css']
})
export class LinkUserComponent implements OnInit {
  user: User;
  errorPasswordNewUser: string;
  errorPasswordLogin: string;
  inputsNewUserForm: Array<any> = [
    {
      label: 'Full name',
      type: 'text',
      name: 'fullname',
      value: 'fullname',
      icon: 'user',
      required: true
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      value: 'email',
      icon: 'envelope',
      required: true
    },
    {
      label: 'Address',
      type: 'text',
      name: 'address',
      value: 'address',
      icon: 'map-marker',
      required: true
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      value: 'password',
      icon: 'key',
      required: true
    },
    {
      label: 'Repeat password',
      type: 'password',
      name: 'repeatPassword',
      value: 'repeatPassword',
      icon: 'key',
      required: true
    },
  ];
  inputsLoginForm: Array<any> = [
    {
      label: 'Email',
      type: 'email',
      name: 'emailLogin',
      value: 'email',
      icon: 'envelope',
      required: true
    },
    {
      label: 'Password',
      type: 'password',
      name: 'passwordLogin',
      value: 'password',
      icon: 'key',
      required: true
    },
  ];

  constructor( private router: Router,
               private userService: UserService) { }

  ngOnInit() {
    this.user = {
      name: '',
      email: '',
      surname: '',
      password: ''
    };
  }

  async handleRegister(userRegister) {
    this.errorPasswordNewUser = '';
    delete userRegister.repeatPassword;

    // TODO: llamada al servidor para vincular el usuario
    try {
      await this.login(userRegister);
    } catch (error) {
      if (error && error.status === 403) {
        this.errorPasswordNewUser = 'Incorrect email or password';
      } else {
        this.errorPasswordNewUser = (error && error.message) ? error.message : 'Internal server error';
      }
    }
  }

  async handleLogin(userRegister: any) {
    this.errorPasswordLogin = '';
    delete userRegister.repeatPassword;
    userRegister.email = (userRegister.emailLogin) ? userRegister.emailLogin : userRegister.email;
    userRegister.password = (userRegister.passwordLogin) ? userRegister.passwordLogin : userRegister.password;

    // TODO: llamada al servidor para vincular el usuario
    try {
      await this.login(userRegister);
    } catch (error) {
      if (error && error.status === 403) {
        this.errorPasswordLogin = 'Incorrect email or password';
      } else {
        this.errorPasswordLogin = (error && error.message) ? error.message : 'Internal server error';
      }
    }
  }

  private async login(userRegister: any) {
    try {
      const userLogin = await this.userService.login(userRegister);
      this.userService.setUserLoggedIn(userLogin);
      this.router.navigate(['/', 'home']);
    } catch (error) {
      throw error;
    }
  }

}

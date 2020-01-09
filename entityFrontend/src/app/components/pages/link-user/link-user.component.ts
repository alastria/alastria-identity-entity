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
  inputsNewUserForm: Array<any> = [
    {
      label: 'Full name',
      type: 'text',
      name: 'fullname',
      value: 'fullname',
      icon: 'user'
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      value: 'email',
      icon: 'envelope'
    },
    {
      label: 'Address',
      type: 'text',
      name: 'address',
      value: 'address',
      icon: 'map-marker'
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      value: 'password',
      icon: 'key'
    },
    {
      label: 'Repeat password',
      type: 'password',
      name: 'repeatPassword',
      value: 'repeatPassword',
      icon: 'key'
    },
  ];
  inputsLoginForm: Array<any> = [
    {
      label: 'Email',
      type: 'email',
      name: 'emailLogin',
      value: 'email',
      icon: 'envelope'
    },
    {
      label: 'Password',
      type: 'password',
      name: 'passwordLogin',
      value: 'password',
      icon: 'key'
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

  handleRegister(userRegister: User): void {
    delete userRegister.repeatPassword;

    // TODO: llamada al servidor para vincular el usuario
    this.handleLogin(userRegister);
  }

  async handleLogin(userRegister: User) {
    delete userRegister.repeatPassword;

    // TODO: llamada al servidor para vincular el usuario
    this.userService.setUserLoggedIn((userRegister));

    const userLogin = await this.userService.login(userRegister);
    this.userService.setUserLoggedIn(userLogin);
    this.router.navigate(['/', 'home']);
  }

}

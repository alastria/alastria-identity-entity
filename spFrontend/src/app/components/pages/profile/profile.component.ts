import { Component, OnInit } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

// MODELS
import { User } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
    `
    :host ::ng-deep app-disabled-form > form,  #create-alastria-id{
      padding-left: 40px;
    }
    `
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  qrAlastriaId: any;
  qrCredentials: any;
  optionsMenu = ['Edit profile', 'Reset password'];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getUserLoggedIn();
  }

  generateQrAlastriaId() {
    this.qrAlastriaId = 'test';
  }

  closeQrAlastriaId(): void {
    this.qrAlastriaId = null;
  }

  generateQrCredentials() {
    this.qrCredentials = 'test2';
  }

  closeQrCredentials(): void {
    this.qrCredentials = null;
  }
}

import { Component, OnInit } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

// MODELS
import { UserLogin } from 'src/app/models/userLogin/userLogin.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: UserLogin;
  qrAlastriaId: any;
  qrCredentials: any;

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

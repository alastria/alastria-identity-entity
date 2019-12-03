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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getUserLoggedIn();
  }

}

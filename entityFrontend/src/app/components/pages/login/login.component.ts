import { ResultModal } from './../../../models/result-modal/result-modal';
import { SocketService } from './../../../services/socket/socket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user/user.model';
import { Event } from 'src/app/models/enums/enums.model';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
  export class LoginComponent implements OnInit {

  private subscription: Subscription = new Subscription();
  formLogin: FormGroup;
  errorLogin: string;
  resultModal: ResultModal = {
    type: 'error',
    title: '',
    description: ''
  };
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
              private userService: UserService,
              private socketService: SocketService) { }

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
      this.router.navigate(['/', 'home']);
    } catch (error) {
      console.log('Error ', error);
      if (error && error.status === 403) {
        this.errorLogin = 'User or password incorrect';
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
      this.initIoConnection();
      $('#simpleModal').modal('show');
    } else {
      console.log(socialName);
    }
  }

  handleOk() {
    this.socketService.sendLogin();
  }

  handleResultOK() {
    $('#modal-result').modal('hide');
  }

  /**
   * Function handle when click ok in modal simple
   */
  async onLogin(): Promise<any> {
    try {
      const user: User = {
        name: 'Samuel',
        password: 'test'
      };
      const userLogin = await this.userService.login(user);

      this.userService.setUserLoggedIn(userLogin);
      $('#simpleModal').modal('hide');
      this.router.navigate(['/', 'vinculate']); // TODO: Consultar al servidor si el usuario esta vinculado o no
    } catch (error) {
      console.log('Error ', error);
      if (error && error.status === 403) {
        this.errorLogin = 'User or password incorrect';
      } else {
        this.errorLogin = (error && error.message) ? error.message : 'Internal server error';
      }
    }
  }

  /**
   * Function for init connection with websocket and subscribe in differents events
   */
  private initIoConnection(): void {
    this.socketService.initSocket();

    this.subscription.add(this.socketService.onLogin()
      .subscribe(() => {
        this.onLogin();
        this.socketService.sendDisconnect();
      })
    );

    this.subscription.add(this.socketService.onError()
      .subscribe((error: any) => {
        $('#simpleModal').modal('hide');
        this.socketService.sendDisconnect();
        this.resultModal = {
          type: 'error',
          title: `Error! - error.status`,
          description: error.message
        };
        $('#modal-result').modal('show');
      })
    );

    this.subscription.add(this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected - websocket');
      })
    );

    this.subscription.add(this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected - websocket');
      })
    );
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.socketService.sendDisconnect();
  }
}

import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService} from 'ngx-device-detector';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AlastriaLibService } from 'src/app/services/alastria-lib/alastria-lib.service';

// MODELS
import { User } from 'src/app/models/user/user.model';
import { Event } from 'src/app/models/enums/enums.model';
import { ResultModal } from './../../../models/result-modal/result-modal';

// COMPONENTS
import { UserFormComponent } from '../../common/user-form/user-form.component';

declare var $: any;

@Component({
  selector: 'app-link-user',
  templateUrl: './link-user.component.html',
  styleUrls: ['./link-user.component.css']
})
export class LinkUserComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild(UserFormComponent) userFormComponent: UserFormComponent;
  resultModal: ResultModal = {
    type: 'error',
    title: '',
    description: ''
  };
  isDesktop: boolean;
  user: User;
  qrData: any = '';
  qrSize = 256;
  errorPasswordNewUser: string;
  errorPasswordLogin: string;
  inputsNewUserForm: Array<any> = [
    {
      label: 'Full name',
      type: 'text',
      name: 'fullname',
      value: 'fullname',
      icon: 'user',
      required: false
    },
    {
      label: 'Username',
      type: 'text',
      name: 'username',
      value: 'username',
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
  styleButtonAlastriaId = {
    color: '#00CAD6',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };


  constructor( private router: Router,
               private userService: UserService,
               private socketService: SocketService,
               private alastriaLibService: AlastriaLibService,
               private deviceDetector: DeviceDetectorService,
               private http: HttpClient) {

    this.isDesktop = this.deviceDetector.isDesktop();
  }

  ngOnInit() {
    this.user = {
      id: '',
      name: '',
      email: '',
      surname: '',
      password: ''
    };
    this.initIoConnection();
    this.createPresentationRequest();
  }

  async handleRegister(userRegister) {
    try {
      this.errorPasswordNewUser = '';
      delete userRegister.repeatPassword;
      const userVinculate = this.userService.getUserVinculate();
      if (userVinculate) {
        userRegister.did = userVinculate.did;
        userRegister.proxyAddress = userVinculate.proxyAddress;
        userRegister.vinculated = true;
      }
    // TODO: llamada al servidor para vincular el usuario
      await this.userService.createUser(userRegister);
      await this.login(userRegister, true);
      sessionStorage.removeItem('userVinculate');
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
      await this.login(userRegister, false);
    } catch (error) {
      if (error && error.status === 403) {
        this.errorPasswordLogin = 'Incorrect email or password';
      } else {
        this.errorPasswordLogin = (error && error.message) ? error.message : 'Internal server error';
      }
    }
  }

  showModalQr() {
    $('#simpleModal').modal('show');
  }

  sendNewUser() {
    this.socketService.sendGetPresentationData();
  }

  handleResultOK() {
    $('#modal-result').modal('hide');
  }

  private async createPresentationRequest() {
    try {
      const url = '../../../assets/alastria-lib.json';
      const alastriaLibJson: any = await this.http.get(url).toPromise();
      alastriaLibJson.payload.pr.data = [
        {
            '@context': 'JWT',
            levelOfAssurance: 'High',
            required: true,
            field_name: 'name'
        },
        {
          '@context': 'JWT',
          levelOfAssurance: 'High',
          required: true,
          field_name: 'email'
        },
      ];

      const presentationRequest = this.alastriaLibService.createPresentationRequest(alastriaLibJson.header, alastriaLibJson.payload);
      // TODO GET PRIVATE KEY
      const presentationRequestSigned = this.alastriaLibService.signJWT(presentationRequest, alastriaLibJson.privateKey);
      this.qrData = presentationRequestSigned;
    } catch (error) {
      console.error(error);
    }
  }

  private async login(userRegister: any, isRegister: boolean) {
    try {
      const userLogin = await this.userService.login(userRegister);
      if (isRegister) {
        this.userService.setUserLoggedIn(userLogin);
      } else {
        const userVinculate = this.userService.getUserVinculate();
        if (userVinculate) {
          userVinculate.id = userLogin.id;
          const userUpdate = await this.userService.updateUser(userVinculate);
          this.userService.setUserLoggedIn(userUpdate);
        }
        this.userService.setUserLoggedIn(userLogin);
      }
      sessionStorage.removeItem('userVinculate');
      this.router.navigate(['/', '/profile']);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function for init connection with websocket and subscribe in differents events
   */
  private initIoConnection(): void {
    this.socketService.initSocket();

    this.subscription.add(this.socketService.onGetPresentationData()
      .subscribe((newUser: User) => {
        this.user = newUser;
        this.userFormComponent.setValuesForm(newUser);
        this.socketService.sendDisconnect();
        $('#simpleModal').modal('hide');
      })
    );

    this.subscription.add(this.socketService.onError()
      .subscribe((error: any) => {
        this.socketService.sendDisconnect();
        $('#simpleModal').modal('hide');
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

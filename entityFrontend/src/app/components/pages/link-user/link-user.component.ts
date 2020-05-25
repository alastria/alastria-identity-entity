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
import { EntityService } from 'src/app/services/entity/entity.service';

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
               private http: HttpClient,
               private entityService: EntityService) {

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
      if (error && error.status === 401) {
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
      let presentationRequestInfo = [
        {
            '@context': 'JWT',
            levelOfAssurance: 3,
            required: true,
            field_name: 'fullname'
        },
        {
          '@context': 'JWT',
          levelOfAssurance: 3,
          required: true,
          field_name: 'email'
        },
      ];
      const presentationRequest = await this.entityService.createPresentationRequest(presentationRequestInfo);
      this.qrData = presentationRequest;
    } catch (error) {
      console.error(error);
    }
  }

  private async login(userRegister: any, isRegister: boolean) {
    try {
      const userLogin = await this.userService.login(userRegister);
      console.log('USERLOGIN LINK ----->', userLogin)
      userLogin.id = (userLogin._id) ? userLogin._id : userLogin.id
      delete userLogin._id
      console.log('USERLOGIN LINK deleted _id----->', userLogin)
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
      this.router.navigate(['/', 'profile']);
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
      .subscribe((newUser: any) => {
        const data = newUser.message;
        let formNewValues = {};

        if (data && data.length) {
          formNewValues = {
            fullname: (data[0].fullname) ? data[0].fullname : (data[1].fullname) ? data[1].fullname : '',
            email: (data[1].email) ? data[1].email : (data[0].email) ? data[0].email : ''
          };
        }
        this.userFormComponent.setValuesForm(formNewValues);
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

import { Identity } from './../../../models/identity/identity.model';
import { Component, OnInit } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { ServiceProviderService } from 'src/app/services/serviceProvider/service-provider.service';

// MODELS
import { User } from 'src/app/models/user/user.model';
import { Event } from 'src/app/models/enums/enums.model';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
    `
    :host ::ng-deep app-disabled-form > form,  #create-alastria-id{
      padding-left: 40px;
    }
    :host ::ng-deep app-generate-qr qrcode > img{
      margin: auto;
    }
    `
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  qrAlastriaId: string;
  qrCredentials: any;
  optionsMenu = ['Edit profile', 'Reset password'];
  ioConnection: any; // websocket connection
  htmlSuccessCreateAlastriaId = `
    <img src="../../../../assets/images/success-icon.svg" alt="Success icon">
    <h1> Success! </h1>
    <p> Congratulations, your Alastria ID has been created and vinculated with your accouunt </p>
  `;
  styleButtonAlastriaId = {
    color: '#00CAD6',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };
  isAlastriaVerified: boolean;
  qrDataFillProfile: any = '[]';
  isDisabledProfileForm = true;

  constructor(private userService: UserService,
              private socketService: SocketService,
              private serviceProvider: ServiceProviderService) { }

  ngOnInit() {
    this.user = this.userService.getUserLoggedIn();
    this.initIoConnection();
    this.checkAlastriaIdIsVerified();
    this.addOptionInMenu();
  }

  /**
   * Handle when a otion of menu is selected
   * @param option - option selected
   */
  handleSelectOption(option: string): void {
    switch (option) {
      case this.optionsMenu[0]:
        this.editProfile();
        break;
      case this.optionsMenu[1]:
        this.resetPassword();
        break;
      case this.optionsMenu[2]:
        this.fillYourProfile();
        break;
      default:
        break;
    }
  }

  /**
   * Handle when generate qr for create alastria id
   * @param  event - config of create alastria id
   */
  handleGenerateQr(event: string): void {
    this.qrAlastriaId = event;

    // MOCK - WEBSOCKET
    if (this.qrAlastriaId) {
      setTimeout(() => {
        this.socketService.send('Test');
      }, 5000);
    }
  }

  /**
   * When click in 'ok' in simple modal then active this function that hide
   * the modal and check alastria id is verified
   */
  handleOk(): void {
    $('#simpleModal').modal('hide');
    this.checkAlastriaIdIsVerified();
    this.addOptionInMenu();
  }

  handleOkFillProfile(): void {
    $('#simpleModal').modal('hide');
  }

  /**
   * handle when click in 'save' of edit profile then set user from
   * userService and call editProfile()
   * @param user - new data of user for change
   */
  handleEditProfile(user: User): void {
    this.userService.setUserLoggedIn(user);
    this.user = this.userService.getUserLoggedIn();
    this.editProfile();
  }

  /**
   * Handle when click in fill your profile button of modal form then
   * hide modalFillProfile and show simple modal with qr
   * @param profileFields - fields of profile for show in qr modal
   */
  async handleFillYourProfile(profileFields: Array<string>) {
    await $('#modalFillProfile').modal('hide');
    this.qrDataFillProfile = JSON.stringify(profileFields);
    $('#simpleModal').modal('show');
  }

 private checkAlastriaIdIsVerified() {
    this.isAlastriaVerified = this.userService.getIsAlastriaIdVerified();
  }

  private addOptionInMenu() {
    const titleOption = 'Fill your profile';
    if (this.isAlastriaVerified && !this.optionsMenu.includes(titleOption)) {
      this.optionsMenu.push(titleOption);
    }
  }

  private editProfile(): void {
    this.isDisabledProfileForm = !this.isDisabledProfileForm;
  }

  private resetPassword(): void {
    console.log('RESET PASSWORD');
  }

  private fillYourProfile(): void {
    $('#modalFillProfile').modal('show');
  }

  /**
   * Function for init connection with websocket and subscribe in differents events
   */
  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        const identity: Identity = {
          signedTX: message,
          address: ''
        };

        this.serviceProvider.createIdentity(identity)
          .then((result: any) => {
            if (result && result.status === 200) {
              this.userService.setIsAlastriaIdVerified(true);
              $('#simpleModal').modal('show');
              console.log(result);
            } else {
              this.userService.setIsAlastriaIdVerified(true);
            }
          })
        .catch((error: any) => {
          console.error(error);
        });
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected - websocket');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected - websocket');
      });
  }
}

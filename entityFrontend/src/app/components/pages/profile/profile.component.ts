import { environment } from './../../../../environments/environment';
import { Identity } from './../../../models/identity/identity.model';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

// COMPONENTS
import { CreateAlastriaIdComponent } from '../../common/create-alastria-id/create-alastria-id.component';
import { UserFormComponent } from 'src/app/components/common/user-form/user-form.component';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { EntityService } from 'src/app/services/entity/entity.service';

// MODELS
import { User } from 'src/app/models/user/user.model';
import { Event } from 'src/app/models/enums/enums.model';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
    `
    :host ::ng-deep app-user-form > form,  #create-alastria-id{
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
  @ViewChild(CreateAlastriaIdComponent) createAlastriaIdComponent: CreateAlastriaIdComponent;
  @ViewChild(UserFormComponent) userFormComponent: UserFormComponent;
  user: User;
  qrAlastriaId: string;
  qrCredentials: any;
  optionsMenu = ['Edit profile', 'Reset password', 'Alastria ID'];
  htmlSuccess = `
      <img width="50%" src="../../../../assets/images/success-icon.svg" alt="Success icon">
      <h1> Congratulations! </h1>
      <p> Your Alastria ID has been created. Start to fill you new AlastriaID </p>
  `;
  styleButtonAlastriaId = {
    color: '#00CAD6',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };
  parametersForCreateAlastriaId: any;
  isAlastriaVerified: boolean;
  isCreateAlastriaId: boolean;
  qrDataFillProfile: any = '[]';
  inputsUserForm: Array<any> = [
    {
      label: 'Full name',
      type: 'text',
      name: 'fullName',
      value: 'fullName',
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
  ];

  constructor(private userService: UserService,
              private socketService: SocketService,
              private entityService: EntityService,
              private changeDetector: ChangeDetectorRef) { }

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
      case 'Fill your AlastriaID profile':
        this.fillYourProfile();
        break;
      case 'Alastria ID':
        $('#modalCreateAlastriaId').modal('show');
        break;
      default:
        break;
    }
  }

  handleCreateAlastriaId() {
    $('#modalCreateAlastriaId').modal('hide');
    this.isCreateAlastriaId = true;
    this.parametersForCreateAlastriaId = {
      title: 'Create your AlastriaID',
      subtitle: 'Scan this QR with your AlastriaID app to create your AlastriaID',
      type: 'C'
    };
    this.changeDetector.detectChanges();
    this.createAlastriaIdComponent.createOrSetUpAlastriaId();
  }

  handleSetUpAlastriaId() {
    $('#modalCreateAlastriaId').modal('hide');
    this.isCreateAlastriaId = true;
    this.parametersForCreateAlastriaId = {
      title: `Set up your Alastria ID for ${environment.entityName}`,
      subtitle: 'Scan this QR with your AlastriaID',
      type: 'S'
    };
    this.changeDetector.detectChanges();
    this.createAlastriaIdComponent.createOrSetUpAlastriaId();
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
        if (this.parametersForCreateAlastriaId.type === 'C') {
          this.socketService.sendCreate('0xf9016781a980830927c094812c27bb1f50bcb4a2fea015bd89c3691cd759a580b901046d69d99a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a450382c1a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000042303366646435376164656333643433386561323337666534366233336565316530313665646136623538356333653237656136363638366332656135333538343739000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001ca0cdf15464981e07eea36867ee40d24091a20a1c0750dc2db5b4a4136d1e4e4d80a03679a4efecffd8122ddba7391feaefb1a0a4623a224701bb8f97c6763e915f55');
        } else {
          this.socketService.sendSetUp();
        }
      }, 5000);
    }
  }

  /**
   * When click in 'ok' in simple modal then active this function that hide
   * the modal and check alastria id is verified
   */
  handleOk(): void {
    $('#simpleModal').modal('hide');
    this.qrAlastriaId = null;
    this.isCreateAlastriaId = false;
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
    const titleOption = 'Fill your AlastriaID profile';
    if (this.isAlastriaVerified && !this.optionsMenu.includes(titleOption)) {
      this.optionsMenu.splice(this.optionsMenu.length - 1, 1);
      this.optionsMenu.push(titleOption);
    }
  }

  private editProfile(): void {
    this.userFormComponent.toggleFormState();
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

    this.socketService.onCreateIdentity()
      .subscribe((message: any) => {
        const identity: Identity = {
          signedTX: message,
          address: ''
        };

        this.entityService.createIdentity(identity)
          .then((result: any) => {
            if (result && result.proxyAddress && result.did) {
              this.userService.setIsAlastriaIdVerified(true);
              const userChange = this.userService.getUserLoggedIn();
              userChange.proxyAddress = result.proxyAddress;
              userChange.did = result.did;
              this.userService.setUserLoggedIn(userChange);
              $('#simpleModal').modal('show');
            } else {
              this.userService.setIsAlastriaIdVerified(true);
            }
          })
        .catch((error: any) => {
          console.error(error);
        });
      });

    this.socketService.onSetUpAlastriaId()
      .subscribe(() => {
        console.log('Set up');
        this.htmlSuccess = `
          <img width="50%" src="../../../../assets/images/success-icon.svg" alt="Success icon">
          <h1> Congratulations! </h1>
          <p> Your AlastriaID has been linked to your ${environment.entityName} profile. Now you can login next times with your AlastriaID </p>
        `;
        $('#simpleModal').modal('show');
        this.userService.setIsAlastriaIdVerified(true);
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

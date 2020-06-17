import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SharedModule } from '../shared/shared.module';
import { DeviceDetectorService } from 'ngx-device-detector';

// COMPONENTS
import { ProfileComponent } from 'src/app/components/pages/profile/profile.component';
import { MenuComponent } from 'src/app/components/common/menu/menu.component';
import { CreateAlastriaIdComponent } from 'src/app/components/common/create-alastria-id/create-alastria-id.component';
import { ModalFillProfileComponent } from 'src/app/components/common/modal-fill-profile/modal-fill-profile.component';
import { ModalCreateAlastriaIdComponent } from 'src/app/components/common/modal-create-alastria-id/modal-create-alastria-id.component';
import { ModalRevokeCredentialsComponent } from 'src/app/components/common/modal-revoke-credentials/modal-revoke-credentials.component';
@NgModule({
  declarations: [
    ProfileComponent,
    MenuComponent,
    CreateAlastriaIdComponent,
    ModalFillProfileComponent,
    ModalCreateAlastriaIdComponent,
    ModalRevokeCredentialsComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    AngularFontAwesomeModule,
    SharedModule
  ],
  providers: [
    DeviceDetectorService
  ]
})
export class ProfileModule { }

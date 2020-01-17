import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SharedModule } from '../shared/shared.module';

// COMPONENTS
import { ProfileComponent } from 'src/app/components/pages/profile/profile.component';
import { GenerateQrComponent } from 'src/app/components/common/generate-qr/generate-qr.component';
import { MenuComponent } from 'src/app/components/common/menu/menu.component';
import { CreateAlastriaIdComponent } from 'src/app/components/common/create-alastria-id/create-alastria-id.component';
import { ModalFillProfileComponent } from 'src/app/components/common/modal-fill-profile/modal-fill-profile.component';
import { ModalCreateAlastriaIdComponent } from 'src/app/components/common/modal-create-alastria-id/modal-create-alastria-id.component';
import { ModalSuccessComponent } from 'src/app/components/common/modal-success/modal-success.component';

@NgModule({
  declarations: [
    ProfileComponent,
    GenerateQrComponent,
    MenuComponent,
    CreateAlastriaIdComponent,
    ModalFillProfileComponent,
    ModalCreateAlastriaIdComponent,
    ModalSuccessComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    AngularFontAwesomeModule,
    SharedModule
  ]
})
export class ProfileModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SharedModule } from '../shared/shared.module';

// COMPONENTS
import { ProfileComponent } from 'src/app/components/pages/profile/profile.component';
import { UserFormComponent } from 'src/app/components/common/user-form/user-form.component';
import { GenerateQrComponent } from 'src/app/components/common/generate-qr/generate-qr.component';
import { MenuComponent } from 'src/app/components/common/menu/menu.component';
import { CreateAlastriaIdComponent } from 'src/app/components/common/create-alastria-id/create-alastria-id.component';
import { ModalFillProfileComponent } from 'src/app/components/common/modal-fill-profile/modal-fill-profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    UserFormComponent,
    GenerateQrComponent,
    MenuComponent,
    CreateAlastriaIdComponent,
    ModalFillProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    AngularFontAwesomeModule,
    SharedModule
  ]
})
export class ProfileModule { }

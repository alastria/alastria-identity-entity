import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SharedModule } from '../shared/shared.module';

// COMPONENTS
import { ProfileComponent } from 'src/app/components/pages/profile/profile.component';
import { DisabledFormComponent } from 'src/app/components/common/disabled-form/disabled-form.component';
import { GenerateQrComponent } from 'src/app/components/common/generate-qr/generate-qr.component';
import { MenuComponent } from 'src/app/components/common/menu/menu.component';
import { CreateAlastriaIdComponent } from 'src/app/components/common/create-alastria-id/create-alastria-id.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DisabledFormComponent,
    GenerateQrComponent,
    MenuComponent,
    CreateAlastriaIdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QRCodeModule,
    AngularFontAwesomeModule,
    SharedModule
  ]
})
export class ProfileModule { }

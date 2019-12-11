import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// COMPONENTS
import { ProfileComponent } from 'src/app/components/pages/profile/profile.component';
import { DisabledFormComponent } from 'src/app/components/common/disabled-form/disabled-form.component';
import { GenerateQrComponent } from 'src/app/components/common/generate-qr/generate-qr.component';
import { MenuComponent } from 'src/app/components/common/menu/menu.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DisabledFormComponent,
    GenerateQrComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    QRCodeModule,
    AngularFontAwesomeModule
  ]
})
export class ProfileModule { }

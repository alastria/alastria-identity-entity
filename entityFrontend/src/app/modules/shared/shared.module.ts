import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { ButtonLoginComponent } from 'src/app/components/common/button-login/button-login.component';
import { SimpleModalComponent } from 'src/app/components/common/simple-modal/simple-modal.component';
import { UserFormComponent } from 'src/app/components/common/user-form/user-form.component';
import { GenerateQrComponent } from 'src/app/components/common/generate-qr/generate-qr.component';

@NgModule({
  declarations: [
    ButtonLoginComponent,
    SimpleModalComponent,
    UserFormComponent,
    GenerateQrComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule
  ],
  exports: [
    ButtonLoginComponent,
    SimpleModalComponent,
    UserFormComponent,
    GenerateQrComponent,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    QRCodeModule
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonLoginComponent } from 'src/app/components/common/button-login/button-login.component';
import { SimpleModalComponent } from 'src/app/components/common/simple-modal/simple-modal.component';
import { UserFormComponent } from 'src/app/components/common/user-form/user-form.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    ButtonLoginComponent,
    SimpleModalComponent,
    UserFormComponent
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
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    QRCodeModule
  ]
})
export class SharedModule { }

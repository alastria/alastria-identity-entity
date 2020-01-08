import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

import { ButtonLoginComponent } from 'src/app/components/common/button-login/button-login.component';
import { SimpleModalComponent } from 'src/app/components/common/simple-modal/simple-modal.component';

@NgModule({
  declarations: [
    ButtonLoginComponent,
    SimpleModalComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule,
  ],
  exports: [
    ButtonLoginComponent,
    SimpleModalComponent
  ]
})
export class SharedModule { }

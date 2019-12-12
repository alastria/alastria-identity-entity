import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonLoginComponent } from 'src/app/components/common/button-login/button-login.component';

@NgModule({
  declarations: [
    ButtonLoginComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonLoginComponent
  ]
})
export class SharedModule { }

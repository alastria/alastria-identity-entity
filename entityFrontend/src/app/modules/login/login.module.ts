import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../shared/shared.module';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

// COMPONENTS
import { LoginComponent } from 'src/app/components/pages/login/login.component';
import { SimpleModalComponent } from 'src/app/components/common/simple-modal/simple-modal.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    SharedModule
  ],
  providers: [
    UserService
  ],
  exports: [
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
  ],
  bootstrap: []
})
export class LoginModule { }

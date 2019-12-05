import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

// COMPONENTS
import { LoginComponent } from 'src/app/components/pages/login/login.component';
import { ButtonLoginComponent } from 'src/app/components/common/button-login/button-login.component';
import { SimpleModalComponent } from 'src/app/components/common/simple-modal/simple-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    ButtonLoginComponent,
    SimpleModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    QRCodeModule
  ],
  providers: [
    UserService
  ],
  exports: [
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    ButtonLoginComponent,
    SimpleModalComponent,
  ],
  bootstrap: []
})
export class LoginModule { }

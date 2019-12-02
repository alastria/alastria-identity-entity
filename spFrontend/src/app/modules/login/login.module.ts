import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

// COMPONENTS
import { ButtonLoginComponent } from 'src/app/components/common/button-login/button-login.component';

@NgModule({
  declarations: [
    ButtonLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [
    UserService
  ],
  exports: [
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonLoginComponent
  ],
  bootstrap: []
})
export class LoginModule { }

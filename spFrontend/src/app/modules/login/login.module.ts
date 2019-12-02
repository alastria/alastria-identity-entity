import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';

// SERVICES
import { UserService } from 'src/app/services/user/user.service';

@NgModule({
  declarations: [],
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
    ReactiveFormsModule
  ],
  bootstrap: []
})
export class LoginModule { }

import { HomeModule } from './modules/home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// MODULES
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './modules/login/login.module';
import { ProfileModule } from './modules/profile/profile.module';
import { LinkUserModule } from './modules/link-user/link-user.module';

// COMPONENTS
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';

// SERVICES
import { AuthGuardService } from './services/auth/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    LoginModule,
    HomeModule,
    ProfileModule,
    LinkUserModule
  ],
  exports:[
    AngularFontAwesomeModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// MODULES
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './modules/login/login.module';
import { ProfileModule } from './modules/profile/profile.module';
// COMPONENTS
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LinkUserComponent } from './components/pages/link-user/link-user.component';

// SERVICES
import { AuthGuardService } from './services/auth/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LinkUserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    ProfileModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

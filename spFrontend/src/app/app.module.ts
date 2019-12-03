import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// MODULES
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './modules/login/login.module';
import { HomeModule } from './modules/home/home.module';

// COMPONENTS
import { AppComponent } from './app.component';

// SERVICES
import { AuthGuardService } from './services/auth/auth-guard.service';
import { HeaderComponent } from './components/shared/header/header.component';

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
    LoginModule,
    HomeModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

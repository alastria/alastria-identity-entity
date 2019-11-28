import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// SERVICES
import { AuthGuardService } from './services/auth/auth-guard.service';

// COMPONENTS
import { LoginComponent } from './components/pages/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent,  pathMatch: 'full'},
  { path: 'home', component: HomeComponent,  pathMatch: 'full', canActivate: [ AuthGuardService ]},
  { path: '**', pathMatch: 'full', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

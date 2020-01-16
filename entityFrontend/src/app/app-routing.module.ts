import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// SERVICES
import { AuthGuardService } from './services/auth/auth-guard.service';

// COMPONENTS
import { LoginComponent } from './components/pages/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { LinkUserComponent } from './components/pages/link-user/link-user.component';
import { ServiceDetailComponent } from './components/pages/service-detail/service-detail.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent,  pathMatch: 'full'},
  { path: 'vinculate', component: LinkUserComponent,  pathMatch: 'full', canActivate: [ AuthGuardService ]},
  { path: 'home', component: HomeComponent,  pathMatch: 'full', canActivate: [ AuthGuardService ]},
  { path: 'service/:id', component: ServiceDetailComponent, pathMatch: 'full', canActivate: [ AuthGuardService ]},
  { path: 'profile', component: ProfileComponent,  pathMatch: 'full', canActivate: [ AuthGuardService ]},
  { path: '**', pathMatch: 'full', redirectTo: '/home'}
];
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

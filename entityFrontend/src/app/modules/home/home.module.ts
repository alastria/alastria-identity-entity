import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { MenuCardComponent } from './../../components/common/menu-card/menu-card.component';
import { HomeComponent } from './../../components/pages/home/home.component';

// MODULES
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// SERVICES
import { HomeService } from './../../services/home/home.service';

@NgModule({
  declarations: [
    HomeComponent,
    MenuCardComponent
  ],
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }

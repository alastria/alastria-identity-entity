import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { MenuCardComponent } from './../../components/common/menu-card/menu-card.component';
import { HomeComponent } from './../../components/pages/home/home.component';

// MODULES
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    HomeComponent,
    MenuCardComponent
  ],
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
  ]
})
export class HomeModule { }

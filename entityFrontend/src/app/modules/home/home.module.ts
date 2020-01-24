import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

// COMPONENTS
import { MenuCardComponent } from './../../components/common/menu-card/menu-card.component';
import { HomeComponent } from './../../components/pages/home/home.component';
import { ServiceDetailComponent } from 'src/app/components/pages/service-detail/service-detail.component';
import { ServiceFormComponent } from 'src/app/components/common/service-form/service-form.component';

// SERVICES
import { HomeService } from './../../services/home/home.service';

@NgModule({
  declarations: [
    HomeComponent,
    MenuCardComponent,
    ServiceDetailComponent,
    ServiceFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }

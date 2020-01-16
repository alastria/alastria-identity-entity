import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { MenuCardComponent } from './../../components/common/menu-card/menu-card.component';
import { HomeComponent } from './../../components/pages/home/home.component';
import { ServiceDetailComponent } from 'src/app/components/pages/service-detail/service-detail.component';
import { ServiceFormComponent } from 'src/app/components/common/service-form/service-form.component';

// MODULES
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// SERVICES
import { HomeService } from './../../services/home/home.service';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    HomeComponent,
    MenuCardComponent,
    ServiceDetailComponent,
    ServiceFormComponent
  ],
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    QRCodeModule
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }

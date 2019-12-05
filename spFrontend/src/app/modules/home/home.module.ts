import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// COMPONENTS
import { HomeComponent } from 'src/app/components/pages/home/home.component';
import { DisabledFormComponent } from 'src/app/components/common/disabled-form/disabled-form.component';
import { GenerateQrComponent } from 'src/app/components/common/generate-qr/generate-qr.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    HomeComponent,
    DisabledFormComponent,
    GenerateQrComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QRCodeModule,
    AngularFontAwesomeModule,
  ]
})
export class HomeModule { }

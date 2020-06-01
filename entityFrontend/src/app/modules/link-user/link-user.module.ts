import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';

// COMPONENTS
import { LinkUserComponent } from 'src/app/components/pages/link-user/link-user.component';

@NgModule({
  declarations: [
    LinkUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    QRCodeModule,
    DeviceDetectorModule
  ],
  providers: [
    DeviceDetectorService
  ]
})
export class LinkUserModule { }

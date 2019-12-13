import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Services
import { ServiceProviderService } from 'src/app/services/serviceProvider/service-provider.service';

@Component({
  selector: 'app-create-alastria-id',
  templateUrl: './create-alastria-id.component.html',
  styleUrls: ['./create-alastria-id.component.css'],
  styles: [
    `
    :host ::ng-deep qrcode > img{
      margin: auto
    }
    `
  ],
})
export class CreateAlastriaIdComponent implements OnInit {
  @Output() handleGenerateQr = new EventEmitter<object>();
  styleButtonAlastriaId = {
    color: '#00CAD6',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };
  styleButtonDownload = {
    color: 'black',
    backgroundIcon: 'black',
    colorIcon: 'white',
    width: '120px'
  };

  urlPlayStore = 'http://play.google.com/store/apps/'; // 'http://play.google.com/store/apps/details?id=<package_name>'
  urlAppStore = 'https://apps.apple.com/es/'; // 'http://itunes.apple.com/<país>/app/<nombre-aplicación>/id<ID-aplicación>?mt=8'
  publicKey: object;

  constructor(private serviceProvider: ServiceProviderService) { }

  ngOnInit() {
  }

  goToStore(url: string) {
    window.open(url, '_blank');
  }

  async createAlastriaId(event: any) {
    console.log('Test');
    const alastriaId = 'test';
    try {
      this.publicKey = await this.serviceProvider.getPublicKey(alastriaId);
      this.handleGenerateQr.emit(this.publicKey);
    } catch (error) {
      console.error('Error ', error);
      this.publicKey = {
        alastriaId: 'test'
      };
      this.handleGenerateQr.emit(this.publicKey);
    }
  }

  closeQrAlastriaId(): void {
    this.publicKey = null;
    this.handleGenerateQr.emit(this.publicKey);
  }
}

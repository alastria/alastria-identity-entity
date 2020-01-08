import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  @Output() handleGenerateQr = new EventEmitter<string>();
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
  qrAlastriaId: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  /**
   * Function for go to store of Play store or app store
   * @param url - Play store or app store url
   */
  goToStore(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * When click in create alastria id button then active this function that generate qr and emit handleGenerateQr
   */
  async createAlastriaId(): Promise<any> {
    try {
      this.qrAlastriaId = await this.generateQr();
      this.handleGenerateQr.emit(this.qrAlastriaId);
    } catch (error) {
      console.error('Error ', error);
    }
  }

  /**
   * Function for emit the event close qr
   */
  closeQrAlastriaId(): void {
    this.qrAlastriaId = null;
    this.handleGenerateQr.emit(this.qrAlastriaId);
  }

  /**
   * generate qr with config for create alastria id
   * @returns - config
   */
  private async  generateQr(): Promise<string> {
    const configUrl = '../../../assets/configTest.json';
    const config = await this.http.get(configUrl).toPromise();
    return JSON.stringify(config);
  }
}

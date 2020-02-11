import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// SERVICES
import { AlastriaLibService } from 'src/app/services/alastria-lib/alastria-lib.service';

const alastriaLibJsonUrl = '../../../assets/alastria-lib.json';

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
  @Input() title: string;
  @Input() subtitle: string;
  @Input() type: string; // C --> create alastria id ; S --> set up alastria id

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

  constructor(private http: HttpClient,
              private alastriaLibService: AlastriaLibService) { }

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
  async createOrSetUpAlastriaId(): Promise<any> {
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
  private async generateQr(): Promise<string> {
    try {
      let qr: string;
      qr = await this.createAlastriaToken();
      return qr;
    } catch (error) {
      console.error(error);
    }
  }

  private async createAlastriaToken(): Promise<string> {
    const currentDate = Math.floor(Date.now() / 1000);
    const expDate = currentDate + 600;
    const alastriaLibJson: any = await this.http.get(alastriaLibJsonUrl).toPromise();
    const config = {
      did: alastriaLibJson.header.kid,
      providerUrl: alastriaLibJson.openAccess,
      callbackUrl: (this.type === 'C') ? `${environment.apiUrl}/entity/alastria/identity`
        : `${environment.apiUrl}/entity/alastriaToken`,
      alastriaNetId: 'redT',
      tokenExpTime: expDate,
      tokenActivationDate: currentDate,
      jsonTokenId: Math.random().toString(36).substring(2)
    };
    const alastriaToken = this.alastriaLibService.createAlastriaToken(config);

    return this.alastriaLibService.signJWT(alastriaToken, alastriaLibJson.privateKey);
  }
}

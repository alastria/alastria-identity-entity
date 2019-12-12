import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToStore(url: string) {
    window.open(url, '_blank');
  }

}

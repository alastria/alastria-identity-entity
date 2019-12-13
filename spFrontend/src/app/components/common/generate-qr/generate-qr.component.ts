import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {style, animate, transition, trigger} from '@angular/animations';
import { CreateAlastriaIdComponent } from '../create-alastria-id/create-alastria-id.component';

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.component.html',
  styleUrls: ['./generate-qr.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        // animate(100, style({opacity: 0}))
      ])
    ])
  ]
})
export class GenerateQrComponent implements OnInit {
    @Input() qrData: any;
    @Input() size = 256;
    @Input() level = 'M';
    @Output() handleGenerateQr = new EventEmitter();
    @Output() handleCloseQr = new EventEmitter();

    titleStyle: string;
  constructor() { }

  ngOnInit() {
    console.log(this.qrData);
  }

  generateQr(): void {
    this.handleGenerateQr.emit();
  }

  closeQr(): void {
    this.handleCloseQr.emit();
  }

}

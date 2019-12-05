import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations';

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
    @Input() title: string;
    @Input() textButton: string;
    @Input() qrData: any;
    @Input() size = 256;
    @Input() level = 'M';
    @Output() handleGenerateQr = new EventEmitter();
    @Output() handleCloseQr = new EventEmitter();

    titleStyle: string;
  constructor() { }

  ngOnInit() {
  }

  generateQr(): void {
    this.handleGenerateQr.emit();
  }

  closeQr(): void {
    this.handleCloseQr.emit();
  }

}

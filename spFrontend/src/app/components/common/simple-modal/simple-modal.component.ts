import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.css']
})
export class SimpleModalComponent implements OnInit {
  @Output() handleOk = new EventEmitter();
  @Input() type = 'normal';
  @Input() htmlContent: string;
  @Input() size: string; // xl, lg or sm
  @Input() id = 'simpleModal';
  @Input() qrData: any;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function for emit information when click ok
   */
  loginOk(): void {
      this.handleOk.emit();
    }
  }

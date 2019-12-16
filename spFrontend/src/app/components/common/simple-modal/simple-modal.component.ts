import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { sanitizeHtml } from '@angular/core/src/sanitization/sanitization';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.css']
})
export class SimpleModalComponent implements OnInit {
  @Output() handleLoginOk = new EventEmitter();
  @Input() type = 'normal';
  @Input() htmlContent: string;
  @Input() size: string; // xl, lg or sm
  constructor() { }

  ngOnInit() {
    console.log(this.htmlContent);
  }

  /**
   * Function for emit information when click ok
   */
  loginOk(): void {
      this.handleLoginOk.emit();
    }
  }

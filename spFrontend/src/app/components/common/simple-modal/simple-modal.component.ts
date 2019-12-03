import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.css']
})
export class SimpleModalComponent implements OnInit {
  @Output() handleLoginOk = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function for emit information when click ok
   */
  loginOk(): void {
      this.handleLoginOk.emit();
    }
  }

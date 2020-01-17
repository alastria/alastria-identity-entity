import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.css']
})
export class ModalSuccessComponent implements OnInit {
  @Output() handleOk = new EventEmitter();
  @Input() size: string; // xl, lg or sm
  @Input() title: string; // xl, lg or sm
  @Input() description: string; // xl, lg or sm

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function for emit information when click ok
   */
  ok(): void {
    this.handleOk.emit();
  }
}

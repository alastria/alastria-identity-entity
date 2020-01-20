import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-result',
  templateUrl: './modal-result.component.html',
  styleUrls: ['./modal-result.component.css']
})
export class ModalResultComponent implements OnInit {
  @Output() handleOk = new EventEmitter();
  @Input() type = 'success'; // success - error
  @Input() size: string; // xl, lg or sm
  @Input() title: string;
  @Input() description: string;
  successImgUrl = '../../../../assets/images/success-icon.svg';
  errorImgUrl = '../../../../assets/images/error-icon.svg';

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

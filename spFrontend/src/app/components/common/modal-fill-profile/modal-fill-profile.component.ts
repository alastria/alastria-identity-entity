import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-modal-fill-profile',
  templateUrl: './modal-fill-profile.component.html',
  styleUrls: ['./modal-fill-profile.component.css']
})
export class ModalFillProfileComponent implements OnInit {
  @Output() handleFillYourProfile = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function for emit information when click ok
   */
  fillYourProfile(): void {
      this.handleFillYourProfile.emit();
    }
  }

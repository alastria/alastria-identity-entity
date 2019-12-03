import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {
  @Input() iconClass: string;
  @Input() title: string;
  @Input() socialName: string;
  @Input() style: object = {};
  @Input() imgUrl: object = null;
  @Output() handleLoginSocial = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function for emit social name information when click in button
   */
  onLogin() {
      this.handleLoginSocial.emit(this.socialName);
    }

  }

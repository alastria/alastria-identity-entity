import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {
  @Input() iconClass: string;
  @Input() title: string;
  @Input() style: object = {};
  @Input() imgUrl: object = null;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() options: Array<string>;
  @Output() handleSelectOption = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectOption(option: string) {
    this.handleSelectOption.emit(option);
  }

}

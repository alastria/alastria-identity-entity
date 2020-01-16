import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.css']
})
export class MenuCardComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() title: string;
  @Input() description: string;
  @Input() buttonText: string;
  @Output() handleSelectCard = new EventEmitter<string>();
  imageAlt = `Image of ${this.title}`;

  constructor() { }

  ngOnInit() {
  }

  selectCard() {
    this.handleSelectCard.emit(this.title);
  }

}

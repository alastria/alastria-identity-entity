import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Service } from 'src/app/models/services/services.model';

@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.css']
})
export class MenuCardComponent implements OnInit {
  @Input() service: Service;
  @Output() handleSelectCard = new EventEmitter<number>();
  imageAlt = `Image of card`;

  constructor() { }

  ngOnInit() {
    this.imageAlt = `Image of ${this.service.title}`;
  }

  selectCard() {
    this.handleSelectCard.emit(this.service.id);
  }

}

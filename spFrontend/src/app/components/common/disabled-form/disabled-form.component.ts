import { Component, OnInit, Input } from '@angular/core';

// MODELS
import { User } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-disabled-form',
  templateUrl: './disabled-form.component.html',
  styleUrls: ['./disabled-form.component.css']
})
export class DisabledFormComponent implements OnInit {

  @Input() user: User;
  fullName: string;

  constructor() { }

  ngOnInit() {
    this.generateFullName();
  }

  generateFullName() {
    this.fullName = (this.user) ? `${this.user.name} ${this.user.surname}` : '';
  }

}

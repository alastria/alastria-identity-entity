import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-disabled-form',
  templateUrl: './disabled-form.component.html',
  styleUrls: ['./disabled-form.component.css']
})
export class DisabledFormComponent implements OnInit {

  @Input() username: string;
  @Input() email: string;

  constructor() { }

  ngOnInit() {
  }

}

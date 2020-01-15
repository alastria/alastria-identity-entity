import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-create-alastria-id',
  templateUrl: './modal-create-alastria-id.component.html',
  styleUrls: ['./modal-create-alastria-id.component.css']
})
export class ModalCreateAlastriaIdComponent implements OnInit {
  @Output() handleCreateAlastriaId = new EventEmitter();
  @Output() handleSetUpAlastriaId = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  emitCreateAlastriaId(e) {
    e.preventDefault();
    this.handleCreateAlastriaId.emit();
  }

  emitSetUpAlastriaId(e) {
    e.preventDefault();
    this.handleSetUpAlastriaId.emit();
  }

}

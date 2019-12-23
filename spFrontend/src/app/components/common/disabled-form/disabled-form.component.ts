import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// MODELS
import { User } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-disabled-form',
  templateUrl: './disabled-form.component.html',
  styleUrls: ['./disabled-form.component.css']
})
export class DisabledFormComponent implements OnInit {

  @Input() user: User;
  @Input() isDisabled: boolean;
  @Output() handleEditProfile = new EventEmitter<User>();
  fullName: string;

  constructor() { }

  ngOnInit() {
    this.generateFullName();
  }

  /**
   * Generate full name for show in html
   */
  generateFullName(): void {
    this.fullName = (this.user) ? `${this.user.name} ${this.user.surname}` : '';
  }

  /**
   * Function for edit profile of user
   */
  editProfile(): void {
    this.fullNameToNameOrSurname();
    this.handleEditProfile.emit(this.user);
  }

  /**
   * Function for get name and surname of the fullName
   */
  private fullNameToNameOrSurname(): void {
    const fullNameSplit = this.fullName.split(' ');
    this.user.name = fullNameSplit[0];
    this.user.surname = '';
    fullNameSplit.map((word: string, index: number) => {
      if (index !== 0) {
        if (index === fullNameSplit.length - 1) {
          this.user.surname += word;
        } else {
          this.user.surname += word + ' ';
        }
      }
    });
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// MODELS
import { User } from 'src/app/models/user/user.model';
import { InputUserForm } from 'src/app/models/input-user-form/input-user-form.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() user: User;
  @Input() buttonName: string;
  @Input() inputsForm: Array<InputUserForm>;
  @Input() isDisabled: boolean;
  @Output() handleEditProfile = new EventEmitter<User>();
  userForm: FormGroup;
  fullName: string;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.generateFullName();
    this.generateForm();
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
    this.generateUser();
    if (this.buttonName.toLowerCase() === 'register') {
      if (this.user.password === this.user.repeatPassword) {
        this.handleEditProfile.emit(this.user);
      }
    } else {
      this.handleEditProfile.emit(this.user);
    }
  }

  setValuesForm(newUser: any) {
    Object.keys(newUser).map(field => {
      this.user = newUser;
      if (this.userForm.get(field)) {
        this.userForm.get(field).setValue(newUser[field]);
      } else {
        if (field === 'name') {
          this.generateFullName();
          this.userForm.get('fullname').setValue(this.fullName);
        }
      }
    });
  }

  /*
   * Enable/disable form control
  */
  public toggleFormState() {
    this.isDisabled = !this.isDisabled;
    const state = this.isDisabled ? 'disable' : 'enable';

    Object.keys(this.userForm.controls).forEach((controlName) => {
        this.userForm.controls[controlName][state](); // disables/enables each form control based on 'this.isDisabled'
    });
  }

  /**
   * Function for get user objet for emit to father component
   */
  private generateUser() {
    this.inputsForm.map((input: InputUserForm) => {
      if (input && input.name.toLowerCase() === 'fullname' && this.userForm.get(input.name).value) {
        this.fullNameToNameOrSurname();
      } else {
        this.user[input.name] = this.userForm.get(input.name).value;
      }
    });
  }

  /**
   * Function for get name and surname of the fullName
   */
  private fullNameToNameOrSurname(): void {
    const fullNameSplit = this.userForm.get('fullname').value.split(' ');
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

  /*
  * Generate userForm with inputsForm
  */
  private generateForm(): void {
    const parametersForm: object = {};
    this.inputsForm.map((input: InputUserForm ) => {
        parametersForm[input.name] = [{ value: this.user[(input.name.toLowerCase() === 'fullname') ? this.fullName : input.value],
          disabled: this.isDisabled }, Validators.required];
    });
    this.userForm = this.fb.group(parametersForm, {
      validator : this.validateAreEqual.bind(this)
    });
  }

  /*
  * Check if passwords are equal
  */
  private validateAreEqual(): void {
    if (this.userForm &&  this.userForm.get('repeatPassword') && this.userForm.get('password')
      && this.userForm.get('repeatPassword').value !== '' && this.userForm.get('password').value !== ''
      && this.userForm.get('repeatPassword').value !== this.userForm.get('password').value) {
        this.userForm.get('repeatPassword').setErrors({mismatch: true});
    } else {
      if (this.userForm && this.userForm.get('repeatPassword')) {
        this.userForm.get('repeatPassword').setErrors({mismatch: false});
      }
    }
  }
}

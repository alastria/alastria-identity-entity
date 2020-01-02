import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal-fill-profile',
  templateUrl: './modal-fill-profile.component.html',
  styleUrls: ['./modal-fill-profile.component.css']
})
export class ModalFillProfileComponent implements OnInit {
  @Output() handleFillYourProfile = new EventEmitter<Array<string>>();
  form: FormGroup;
  options = [
    {
      id: 1,
      label: 'Name & Surname',
      value: 'fullname'
    },
    {
      id: 2,
      label: 'Email',
      value: 'email'
    },
    {
      id: 3,
      label: 'Address',
      value: 'address'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      options: new FormArray([])
    });

    if (this.options) {
      this.addCheckboxes();
    }
  }

  /**
   * function for add checkboxes in the form
   */
  private addCheckboxes(): void {
      this.options.forEach((o, i) => {
      const control = new FormControl(false); // if first item set to true, else false
      (this.form.controls.options as FormArray).push(control);
    });
  }

  ngOnInit() {
  }

  /**
   * Function for emit information when click ok
   */
  fillYourProfile(): void {
    const selectedOptionsIds = this.form.value.options
      .map((v, i) => v ? this.options[i].value : null)
      .filter(v => v !== null);
    this.handleFillYourProfile.emit(selectedOptionsIds);
  }
}

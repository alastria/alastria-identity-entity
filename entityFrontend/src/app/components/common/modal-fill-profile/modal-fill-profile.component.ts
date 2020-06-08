import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

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
    },
    {
      id: 4,
      label: 'Experto Legal en Blockchain',
      value: 'titleLegalBlockchain'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      options: this.fb.array(this.addCheckboxes(), this.maxLengthArray(1))
    });

    if (this.options) {
      this.addCheckboxes();
    }
  }

  ngOnInit() {
  }

  /**
   * Function for emit information when click ok
   */
  fillYourProfile(): void {
    const selectedOptionsValue = this.form.value.options
      .map((v, i) => v ? this.options[i].value : null)
      .filter(v => v !== null);
    this.handleFillYourProfile.emit(selectedOptionsValue);
  }


  /**
   * function for add checkboxes in the form
   */
  private addCheckboxes(): Array<any> {
    const controls = [];
    this.options.forEach((o, i) => {
      controls.push(new FormControl(false));
    });
    return controls;
  }

  maxLengthArray(min: number) {
    return function validate(formGroup: FormGroup) {
      let checked = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          checked++;
        }
      });
      if (checked < min) {
        return {
          limit: true,
        };
      }
      return null;
    }
  }
}

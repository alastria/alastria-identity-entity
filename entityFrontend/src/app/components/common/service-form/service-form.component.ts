import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  qrData = 'Service form';
  serviceForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.generateForm();
  }

  onSubmit() {
    console.log('service form ', this.serviceForm);
  }

  /*
  * Generate serviceForm
  */
  private generateForm(): void {
    this.serviceForm = this.fb.group({
      creditCard: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      over18: [false]
    });
  }

}

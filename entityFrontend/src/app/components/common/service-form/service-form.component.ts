import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  @Output() handleSubmit = new EventEmitter();
  qrData = 'Service form';
  serviceForm: FormGroup;

  constructor(private fb: FormBuilder,
              private socketService: SocketService) { }

  ngOnInit() {
    this.generateForm();
  }

  onSubmit() {
    this.handleSubmit.emit();
  }

  getServiceForm() {
    this.socketService.sendGetDetailUser();
  }

  setValuesForm(formNewValues: any) {
    this.serviceForm.get('creditCard').setValue(formNewValues.creditCard);
    this.serviceForm.get('bloodGroup').setValue(formNewValues.bloodGroup);
    this.serviceForm.get('over18').setValue(formNewValues.over18);
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

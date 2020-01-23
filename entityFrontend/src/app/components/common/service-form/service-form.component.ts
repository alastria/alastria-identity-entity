import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { SocketService } from 'src/app/services/socket/socket.service';
import { AlastriaLibService } from 'src/app/services/alastria-lib/alastria-lib.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  @Output() handleSubmit = new EventEmitter();
  qrData = '';
  serviceForm: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private socketService: SocketService,
              private alastriaLibService: AlastriaLibService) { }

  ngOnInit() {
    this.createPresentationRequest();
    this.generateForm();
  }

  onSubmit() {
    this.handleSubmit.emit();
  }

  getServiceForm() {
    this.socketService.sendGetPresentationData();
  }

  setValuesForm(formNewValues: any) {
    this.serviceForm.get('creditCard').setValue(formNewValues.creditCard);
    this.serviceForm.get('bloodGroup').setValue(formNewValues.bloodGroup);
    this.serviceForm.get('over18').setValue(formNewValues.over18);
  }


  private async createPresentationRequest() {
    try {
      const url = '../../../assets/alastria-lib.json';
      const alastriaLibJson: any = await this.http.get(url).toPromise();
      alastriaLibJson.payload.pr.data = [
        {
            '@context': 'JWT',
            levelOfAssurance: 'High',
            required: true,
            field_name: 'creditCard'
        },
        {
          '@context': 'JWT',
          levelOfAssurance: 'High',
          required: true,
          field_name: 'over18'
        },
      ];

      const presentationRequest = this.alastriaLibService.createPresentationRequest(alastriaLibJson.header, alastriaLibJson.payload);
      this.qrData = JSON.stringify(presentationRequest);

    } catch (error) {
      console.error(error);
    }
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

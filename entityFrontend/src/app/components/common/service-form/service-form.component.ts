import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { SocketService } from 'src/app/services/socket/socket.service';
import { AlastriaLibService } from 'src/app/services/alastria-lib/alastria-lib.service';

declare var $: any;

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  @Output() handleSubmit = new EventEmitter();
  @Output() handleInitConnection = new EventEmitter();
  qrData = '';
  qrSize = 256;
  serviceForm: FormGroup;
  styleButtonAlastriaId = {
    color: '#00CAD6',
    backgroundIcon: 'white',
    colorIcon: 'black'
  };

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private socketService: SocketService,
              private alastriaLibService: AlastriaLibService) { }

  ngOnInit() {
    this.generateForm();
    this.createPresentationRequest();
  }

  onSubmit() {
    this.handleSubmit.emit();
  }

  getServiceForm() {
    this.socketService.sendGetPresentationData();
  }

  setValuesForm(formNewValues: any) {
    this.serviceForm.get('fullname').setValue(formNewValues.fullname);
    this.serviceForm.get('address').setValue(formNewValues.address);
  }

  showModalQr() {
    this.handleInitConnection.emit();
    $('#simpleModal').modal('show');
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
            field_name: 'fullname'
        },
        {
          '@context': 'JWT',
          levelOfAssurance: 'High',
          required: true,
          field_name: 'address'
        },
      ];

      const presentationRequest = this.alastriaLibService.createPresentationRequest(alastriaLibJson.header, alastriaLibJson.payload);
      const presentationRequestSigned = this.alastriaLibService.signJWT(presentationRequest.payload, alastriaLibJson.privateKey);
      this.qrData = presentationRequestSigned;

    } catch (error) {
      console.error(error);
    }
  }

  /*
  * Generate serviceForm
  */
  private generateForm(): void {
    this.serviceForm = this.fb.group({
      fullname: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

}

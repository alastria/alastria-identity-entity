import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { SocketService } from 'src/app/services/socket/socket.service';
import { EntityService } from 'src/app/services/entity/entity.service'

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
              private socketService: SocketService,
              private entityService: EntityService) { }

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
      let requestData = [
        {
            '@context': 'JWT',
            levelOfAssurance: 3,
            required: true,
            field_name: 'fullname'
        },
        {
          '@context': 'JWT',
          levelOfAssurance: 3,
          required: false,
          field_name: 'address'
        },
      ];

      const presentationRequest = await this.entityService.createPresentationRequest(requestData);
      this.qrData = presentationRequest;

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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// SERVICES
import { HomeService } from 'src/app/services/home/home.service';
import { Service } from 'src/app/models/services/services.model';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Event } from 'src/app/models/enums/enums.model';

// COMPONENTS
import { ServiceFormComponent } from '../../common/service-form/service-form.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  @ViewChild(ServiceFormComponent) serviceFormComponent: ServiceFormComponent;
  service: Service;
  detailImageUrl: string;
  detailImageAlt: string;
  isContractServiceSuccess: boolean;

  constructor(private route: ActivatedRoute,
              private homeService: HomeService,
              private socketService: SocketService) { }

  ngOnInit() {
    this.getServiceById();
    this.initIoConnection();
  }

  handleSubmit() {
    this.isContractServiceSuccess = true;
  }

  async getServiceById() {
    const serviceId = parseInt(this.route.snapshot.params.id, 0);
    this.service =  await this.homeService.getServicesById(serviceId);
    this.detailImageUrl = (this.service.detailImageUrl) ? this.service.detailImageUrl : this.service.imageUrl;
    this.detailImageAlt = `Image of ${this.service.title}`;
  }

  /**
   * Function for init connection with websocket and subscribe in differents events
   */
  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onSetServiceFormValues()
      .subscribe((serviceFormNewValues: any) => {
        this.serviceFormComponent.setValuesForm(serviceFormNewValues);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected - websocket');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected - websocket');
      });
  }

}

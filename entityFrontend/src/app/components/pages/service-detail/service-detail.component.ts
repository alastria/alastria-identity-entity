import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// SERVICES
import { HomeService } from 'src/app/services/home/home.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AlastriaLibService } from 'src/app/services/alastria-lib/alastria-lib.service';

// COMPONENTS
import { ServiceFormComponent } from '../../common/service-form/service-form.component';

// MODALS
import { ResultModal } from './../../../models/result-modal/result-modal';
import { Event } from 'src/app/models/enums/enums.model';
import { Service } from 'src/app/models/services/services.model';

declare var $: any;

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild(ServiceFormComponent) serviceFormComponent: ServiceFormComponent;
  resultModal: ResultModal = {
    type: 'error',
    title: '',
    description: ''
  };
  service: Service;
  detailImageUrl: string;
  detailImageAlt: string;
  isContractServiceSuccess: boolean;

  constructor(private route: ActivatedRoute,
              private homeService: HomeService,
              private socketService: SocketService) { }

  ngOnInit() {
    this.getServiceById();
  }

  handleSubmit() {
    this.isContractServiceSuccess = true;
  }

  handleResultOK() {
    $('#modal-result').modal('hide');
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
  initIoConnection(): void {
    this.socketService.initSocket();

    this.subscription.add(this.socketService.onGetPresentationData()
      .subscribe((detailUser: any) => {
        const data = detailUser.message;
        let formNewValues = {};

        if (data && data.length) {
          formNewValues = {
            fullname: (data[0].fullname) ? data[0].fullname : (data[1].fullname) ? data[1].fullname : '',
            address: (!data[1]) ? '' : (data[1].address) ? data[1].address : ''
          };
        }
        this.serviceFormComponent.setValuesForm(formNewValues);
        $('#simpleModal').modal('hide');
        this.socketService.sendDisconnect();
      })
    );

    this.subscription.add(this.socketService.onError()
      .subscribe((error: any) => {
        this.socketService.sendDisconnect();
        this.resultModal = {
          type: 'error',
          title: `Error! - error.status`,
          description: error.message
        };
        $('#modal-result').modal('show');
      })
    );

    this.subscription.add(this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected - websocket');
      })
    );

    this.subscription.add(this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected - websocket');
      })
    );
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.socketService.sendDisconnect();
  }

}

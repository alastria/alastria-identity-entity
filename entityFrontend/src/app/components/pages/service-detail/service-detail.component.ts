import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// SERVICES
import { HomeService } from 'src/app/services/home/home.service';
import { Service } from 'src/app/models/services/services.model';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: Service;
  detailImageUrl: string;

  constructor(private route: ActivatedRoute,
              private homeService: HomeService) { }

  ngOnInit() {
    this.getServiceById();
  }

  async getServiceById() {
    const serviceId = parseInt(this.route.snapshot.params.id, 0);
    this.service =  await this.homeService.getServicesById(serviceId);
    this.detailImageUrl = (this.service.detailImageUrl) ? this.service.detailImageUrl : this.service.imageUrl;
  }

}

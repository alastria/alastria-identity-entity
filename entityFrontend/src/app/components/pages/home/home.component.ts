import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// MODELS
import { Service } from 'src/app/models/services/services.model';

// SERVICES
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  services: Array<Service>;

  constructor(private homeService: HomeService,
              private router: Router) { }

  ngOnInit() {
    this.getServices();
  }

  selectService(serviceId: number) {
    console.log({serviceId});
    this.router.navigate(['/', 'service', serviceId]);
  }

  async getServices() {
    this.services = await this.homeService.getServices();
  }

}

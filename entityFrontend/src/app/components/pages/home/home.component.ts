import { Component, OnInit } from '@angular/core';

// MODELS
import { Services } from 'src/app/models/services/services.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  services: Array<Services> =  [
    {
      imageUrl: '../../../assets/images/service1.jpg',
      title: 'Service 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac faucibus lectus erdiet.',
      buttonText: 'CONTRACT'
    },
    {
      imageUrl: '../../../assets/images/service2.jpg',
      title: 'Service 2',
      description: 'Ut lobortis dui. Quisque non diam lobortis, maximus sem vitae, condimentum eros in ornare',
      buttonText: 'CONTRACT'
    },
    {
      imageUrl: '../../../assets/images/service3.jpg',
      title: 'Service 3',
      description: 'Venenatis elit eget faucibus.  Proin egestas id nisl quis faucibus. Mauris efficitur  sit amet sem id illit',
      buttonText: 'CONTRACT'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  selectService(serviceName: string) {
    console.log({serviceName});
  }

}

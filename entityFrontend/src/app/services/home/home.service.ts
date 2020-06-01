import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// MODELS
import { Service } from 'src/app/models/services/services.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  async getServices(): Promise<Array<Service>> {
    try {
      const servicesUrl = '../../../assets/services.json';
      const services: any = await this.http.get(servicesUrl).toPromise();

      return services;
    } catch (error) {
      throw error;
    }

  }

  async getServicesById(id: number): Promise<Service> {
    try {
      const servicesUrl = '../../../assets/services.json';
      const services: any = await this.http.get(servicesUrl).toPromise();
      return services.find((service: Service) => service.id === id);
    } catch (error) {
      throw error;
    }

  }
}

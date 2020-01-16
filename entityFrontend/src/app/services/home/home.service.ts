import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  async getServices() {
    try {
      const servicesUrl = '../../../assets/services.json';
      const services: any = await this.http.get(servicesUrl).toPromise();

      return services;
    } catch (error) {
      throw error;
    }

  }
}

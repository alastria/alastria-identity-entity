import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

// MODELS
import { Event } from 'src/app/models/enums/enums.model';

import { environment } from './../../../environments/environment';


const webSocket = WebSocket; // Here we stub out the window object

const SERVER_URL = environment.websocketUrl;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor() {

  }
  private socket: any;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public sendCreate(message: any): void {
    this.socket.emit('createIdentity', message);
  }

  public sendSetUp(): void {
    this.socket.emit('setUpAlastriaId');
  }

  public sendServiceForm(): void {
    this.socket.emit('setServiceFormValues');
  }

  public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('message', (data: any) => observer.next(data));
      });
  }

  public onCreateIdentity(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('createIdentity', (data: any) => observer.next(data));
    });
  }

  public onSetUpAlastriaId(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('setUpAlastriaId', (data: any) => observer.next(data));
    });
  }

  public onSetServiceFormValues(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('setServiceFormValues', (data: any) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}

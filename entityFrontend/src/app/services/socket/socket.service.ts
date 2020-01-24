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

  public sendLogin(): void {
    this.socket.emit('login');
  }


  public sendCreate(message: any): void {
    this.socket.emit('createIdentity', message);
  }

  public sendSetUp(): void {
    this.socket.emit('setUpAlastriaId');
  }

  public sendGetPresentationData(): void {
    this.socket.emit('getPresentationData');
  }

  public sendFillYourProfile(): void {
    this.socket.emit('fillYourProfile');
  }

  public sendDisconnect(): void {
    this.socket.close();
  }

  public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('message', (data: any) => observer.next(data));
      });
  }

  public onLogin(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('login', (data: any) => observer.next(data));
    });
  }

  public onGetPresentationData(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('getPresentationData', (data: any) => observer.next(data));
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

  public onFillYourProfile(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('fillYourProfile', (data: any) => observer.next(data));
    });
  }

  public onError(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('onError', (data: any) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}

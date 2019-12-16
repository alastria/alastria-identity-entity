import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

import { Event } from 'src/app/models/enums/enums.model';

import * as socketIo from 'socket.io-client';


const webSocket = WebSocket; // Here we stub out the window object

const SERVER_URL = 'ws://localhost:8080';

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

  public send(message: any): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('message', (data: any) => observer.next(data));
      });
  }

  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}

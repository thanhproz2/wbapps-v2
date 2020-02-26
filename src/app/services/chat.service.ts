import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ApiUrl } from '../utils/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url: string;
  private socket;
  constructor(
    private apiUrl: ApiUrl
  ) { 
    this.url = this.apiUrl.group_chat_threads_address;
    this.socket = io(this.url, {
      forceNew: true
    });
  }

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  sendMessage(message) {
    this.socket.emit('message', message);
  }

  getMessage() {
    return Observable.create(observer => {
      this.socket.on("new-message", data => {
        observer.next(data);
      });
    });
  }
  refreshMessage(data: any): void {
    this.socket.emit('refresh-message', data);
  }
  refreshedMessage() {
    return Observable.create(observer => {
      this.socket.on("refreshed-message", data => {
        observer.next(data);
      });
    });
  }
}

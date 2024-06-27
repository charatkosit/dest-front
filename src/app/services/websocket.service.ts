import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private wSocket: WebSocket | null = null;
  private debugFlag = true;

  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();

  constructor() {}

  connect(url: string): void {
    this.wSocket = new WebSocket(url);
    this.wSocket.onopen = () => {
      if (this.debugFlag) {
        console.log("WebSocket: onopen() event called.");
      }
    };

    this.wSocket.onmessage = (evt) => {
      this.messageSubject.next(evt.data);
    };

    this.wSocket.onclose = () => {
      this.handleConnectionError("Agent: No connection");
    };

    this.wSocket.onerror = () => {
      this.handleConnectionError("Agent: No connection");
    };
  }

  sendMessage(message: any): void {
    if (this.wSocket) {
      if (this.debugFlag) {
        console.log(">" + JSON.parse(message).Command);
      }
      this.wSocket.send(message);
    }
  }

  closeConnection(): void {
    if (this.wSocket) {
      this.wSocket.close();
    }
  }

  private handleConnectionError(errorMessage: string): void {
    this.messageSubject.next({ error: errorMessage });
    if (this.debugFlag) {
      console.log("WebSocket error: ", errorMessage);
    }
  }

}

import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, filter, first, Observable, Observer, Subject, take } from 'rxjs';
import { AutoReadIDCard, InitCommand } from '../interfaces/IDCardData';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$!: WebSocketSubject<any>;
  private autoReadData$: BehaviorSubject<AutoReadIDCard | null> = new BehaviorSubject<AutoReadIDCard | null>(null);

  constructor() {
    this.connect();
  }

  //ทำการ connect ไปยัง websocket server แล้ว รอรับ message จาก server
  // แล้วส่ง message เพื่อเลือกเครื่องอ่านบัน  ไปยัง server
  private connect(): void {
    this.socket$ = webSocket('ws://localhost:14820/TDKWAgent');

    this.socket$.subscribe({
      next: (message) => this.handleMessage(message),
      error: (err) => console.error(err),
      complete: () => console.warn('Completed!')
    }

    );

    // ส่งคำสั่งเพื่อเลือกเครื่องอ่านบัตร
    this.sendMessage({
      Command: 'SelectReader',
      ReaderName: 'Identiv uTrust 2700 R Smart Card Reader 0',
    });


  }

  private sendMessage(msg: any): void {
    this.socket$.next(msg);
  }



  //เมื่อได้รับ message จาก server ให้ทำการเช็คว่า message ที่ได้รับมาเป็น message ใด
  // แล้วทำการแสดงข้อความที่ได้รับมา
  // แล้วส่ง message กำหนด ReadOption ไปยัง server
  private handleMessage(message: any): void {
    if (message.Message === 'SelectReaderR') {
      console.log('Reader selected:', message);
      this.sendMessage({
        Command: 'SetAutoReadOptions',
        AutoRead: true,
        IDNumberRead: true,
        IDTextRead: true,
        IDPhotoRead: true,
        IDATextRead: true,
      });
    } else
      if (message.Message === 'SetAutoReadOptionsR' && message.Status === 0) {
        console.log('Auto read options set successfully');
      } else
        if (message.Message === 'AutoReadIDCardE') {
          this.autoReadData$.next(message as AutoReadIDCard);
        }
  }

  public getAutoReadData(): Observable<AutoReadIDCard | null> {
    return this.autoReadData$.asObservable();
  }

}

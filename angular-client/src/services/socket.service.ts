import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

const SERVER_URL = '192.168.0.102:4000';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }


    public sendSocket(message: String): void {
        console.log("send soket ", message);
        this.socket.emit(message);
    }

    // public onMessage(): Observable<Message> {
    //     return new Observable<Message>(observer => {
    //         this.socket.on('message', (data: Message) => observer.next(data));
    //     });
    // }

    // public onEvent(event: Event): Observable<any> {
    //     return new Observable<Event>(observer => {
    //         this.socket.on(event, () => observer.next());
    //     });
    // }
}
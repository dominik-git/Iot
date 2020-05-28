import { Component,HostListener,OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import {KEY_CODE,KEY_CODE_NAME} from '../model/events.model'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'car-web-controller';

  constructor(private socketService: SocketService){}

  ngOnInit(): void {
    this.socketService.initSocket();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownBoardEvent(e: KeyboardEvent) { 
     console.log(e.key,"key down");
    if (e.keyCode == KEY_CODE.UP_ARROW) {
        this.socketService.sendSocket(KEY_CODE_NAME.UP_ARROW);
       
    } else if (e.keyCode == KEY_CODE.DOWN_ARROW) {
        console.log("godown")
        this.socketService.sendSocket(KEY_CODE_NAME.DOWN_ARROW);
       
    } else if (e.keyCode == KEY_CODE.LEFT_ARROW) {
        console.log("goleft")
        this.socketService.sendSocket(KEY_CODE_NAME.LEFT_ARROW);
       
    } else if (e.keyCode == KEY_CODE.RIGHT_ARROW) {
        console.log("goRight")
        this.socketService.sendSocket(KEY_CODE_NAME.RIGHT_ARROW);
    }
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyupBoardEvent(e: KeyboardEvent) { 
    if(e.keyCode == KEY_CODE.UP_ARROW ||
       e.keyCode == KEY_CODE.DOWN_ARROW ||
       e.keyCode == KEY_CODE.LEFT_ARROW ||
       e.keyCode == KEY_CODE.RIGHT_ARROW
       ){
        this.socketService.sendSocket(KEY_CODE_NAME.STOP_MOTOR);
        console.log("stop motor");
       }

  }
}

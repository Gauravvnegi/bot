import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Output() guestInfo = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  openGuestInfo() {
    this.guestInfo.emit({ openGuestInfo: true });
  }
}

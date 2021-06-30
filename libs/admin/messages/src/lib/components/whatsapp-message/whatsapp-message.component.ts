import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-whatsapp-message',
  templateUrl: './whatsapp-message.component.html',
  styleUrls: ['./whatsapp-message.component.scss'],
})
export class WhatsappMessageComponent implements OnInit {
  guestInfoEnable = false;
  refreshData = false;
  selectedChat = null;
  constructor() {}

  ngOnInit(): void {
    this.guestInfoEnable = false;
    this.refreshData = true;
  }

  setSelectedChat(event) {
    this.selectedChat = event.value;
  }

  openGuestInfo(event) {
    if (event.openGuestInfo) {
      this.guestInfoEnable = true;
    }
  }

  closeGuestInfo(event) {
    if (event.close) {
      this.guestInfoEnable = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { IContact } from '../../models/message.model';

@Component({
  selector: 'hospitality-bot-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss'],
})
export class WhatsappComponent implements OnInit {
  guestInfoEnable = false;
  guestData: IContact;
  refreshData = false;
  selectedChat = null;

  ngOnInit(): void {
    this.guestInfoEnable = false;
    this.refreshData = true;
  }

  setSelectedChat(event) {
    this.selectedChat = event.value;
    // this.guestInfoEnable = false;
  }

  openGuestInfo(event) {
    if (event.openGuestInfo) {
      this.guestInfoEnable = true;
    }
  }

  closeGuestInfo(event) {
    if (event.close) {
      this.guestInfoEnable = false;
      this.guestData = event.data;
    }
  }
}

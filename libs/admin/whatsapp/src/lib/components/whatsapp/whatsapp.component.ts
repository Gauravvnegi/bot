import { Component, OnInit } from '@angular/core';
import { IContact } from '../../models/message.model';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'hospitality-bot-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
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

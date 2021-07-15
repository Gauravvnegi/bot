import { Component, HostListener, OnInit } from '@angular/core';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { IContact } from '../../models/message.model';

@Component({
  selector: 'hospitality-bot-whatsapp-message',
  templateUrl: './whatsapp-message.component.html',
  styleUrls: ['./whatsapp-message.component.scss'],
})
export class WhatsappMessageComponent implements OnInit {
  guestInfoEnable = false;
  guestData: IContact;
  refreshData = false;
  selectedChat = null;
  constructor(private firebaseMessagingService: FirebaseMessagingService) {}

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

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.hidden) {
      this.firebaseMessagingService.tabActive.next(false);
      console.log('Page is hidden');
    } else {
      this.firebaseMessagingService.tabActive.next(true);
      console.log('Page is visible');
    }
  }
}

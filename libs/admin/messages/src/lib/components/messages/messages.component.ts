import { Component, OnInit } from '@angular/core';
import { MessageTabService } from 'apps/admin/src/app/core/theme/src/lib/services/messages-tab.service';

@Component({
  selector: 'hospitality-bot-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  tabList = [
    { imgSrc: 'assets/svg/whatsapp.svg', count: 1, dataLoaded: false },
  ];
  guestInfoEnable = false;
  refreshData = false;
  selectedChat = null;
  constructor(private messageTabService: MessageTabService) {}

  ngOnInit(): void {
    this.setTabList();
    this.registerListeners();
  }

  ngOnChanges() {}

  registerListeners() {
    this.listenForTabChange();
  }

  listenForTabChange() {
    this.messageTabService.selectedTabMenu$.subscribe((response) => {
      this.loadChatList(response);
    });
  }

  setTabList() {
    this.messageTabService.tabList$.next(this.tabList);
  }

  loadChatList(index) {
    if (!this.tabList[index].dataLoaded) {
      this.tabList[index].dataLoaded = true;
      this.guestInfoEnable = false;
      this.refreshData = true;
    }
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

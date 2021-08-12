import { Component, OnInit } from '@angular/core';
import { MessageTabService } from 'apps/admin/src/app/core/theme/src/lib/services/messages-tab.service';
import { MessageService } from 'libs/admin/whatsapp/src/lib/services/messages.service';

@Component({
  selector: 'hospitality-bot-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  tabList = [
    {
      imgSrc: 'assets/svg/whatsapp.svg',
      count: 0,
      dataLoaded: false,
      name: 'whatsapp',
    },
  ];
  selectedIndex = 0;
  constructor(
    private messageTabService: MessageTabService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.setTabList();
    this.registerListeners();
  }

  ngOnChanges() {}

  registerListeners() {
    this.listenForTabChange();
    this.listenForWhatsappCount();
  }

  listenForTabChange() {
    this.messageTabService.selectedTabMenu$.subscribe((response) => {
      this.loadChatList(response);
    });
  }

  listenForWhatsappCount() {
    this.messageService
      .getWhatsappUnreadContactCount()
      .subscribe((response) => {
        const index = this.tabList.findIndex((x) => x.name === 'whatsapp');
        this.tabList[index].count = response;
        this.messageTabService.tabList$.next(this.tabList);
      });
  }

  setTabList() {
    this.messageTabService.tabList$.next(this.tabList);
  }

  loadChatList(index) {
    if (!this.tabList[index].dataLoaded) {
      this.selectedIndex = index;
      this.tabList[index].dataLoaded = true;
    }
  }
}

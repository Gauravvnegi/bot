import { Component, OnInit } from '@angular/core';
import { MessageTabService } from '../../services/messages-tab.service';

@Component({
  selector: 'admin-message-tab-menu',
  templateUrl: './message-tab-menu.component.html',
  styleUrls: ['./message-tab-menu.component.scss'],
})
export class MessageTabMenuComponent implements OnInit {
  tabList = [];
  selectedIndex = 0;
  constructor(private messageTabService: MessageTabService) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForMessageTabs();
    this.listenForSelectedIndex();
  }

  listenForMessageTabs() {
    this.messageTabService.tabList$.subscribe((response) => {
      if (response) {
        this.tabList = response;
      }
    });
  }

  listenForSelectedIndex() {
    this.messageTabService.selectedTabMenu$.subscribe((response) => {
      if (this.selectedIndex !== response) {
        this.selectedIndex = response;
      }
    });
  }

  onTabChanged(event) {
    this.messageTabService.selectedTabMenu$.next(event.index);
  }
}

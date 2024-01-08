import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  SettingsMenuItem,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit {
  settings: SettingsMenuItem[];
  isImageLoaded = false;
  isSidebar = false;
  @Output() onCloseSidebar = new EventEmitter(false);

  page: SettingsPages = 'SETTINGS_MENU';

  constructor(private subscriptionService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.settings = this.subscriptionService.settings;
  }

  close() {
    this.onCloseSidebar.emit(false);
  }

  onImageLoad() {
    this.isImageLoaded = true;
  }

  handelSettingsMenuClick(name: string) {
    if (name === 'NOTIFICATION') this.page = 'NOTIFICATION';
    else this.close();
  }

  setDefaultPage() {
    this.page = 'SETTINGS_MENU';
  }
}

type SettingsPages = 'NOTIFICATION' | 'SETTINGS_MENU';

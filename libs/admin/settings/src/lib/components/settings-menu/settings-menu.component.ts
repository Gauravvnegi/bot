import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsMenuItem } from 'apps/admin/src/app/core/theme/src/lib/data-models/subscription-plan-config.model';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';

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

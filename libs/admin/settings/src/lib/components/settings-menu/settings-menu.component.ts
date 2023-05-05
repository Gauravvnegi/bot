import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SettingsMenuItem,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { SettingOptions } from '../../constant/settings-menu';

@Component({
  selector: 'hospitality-bot-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit {
  settings: SettingsMenuItem[];

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.settings = this.subscriptionService.settings;
  }

  selectSetting(settingName: SettingOptions, isDisabled: boolean) {
    if (isDisabled) return;
    switch (settingName) {
      case SettingOptions.ROLES_AND_PERMISSION:
        this.router.navigate(['/pages/roles-permissions']);
        break;
      case SettingOptions.NOTIFICATION:
        break;
      default:
        this.router.navigate([`/pages/settings/${settingName}`]);
        break;
    }
  }
}

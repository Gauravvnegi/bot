import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import {
  SettingOptions,
  settingsMenuOptions,
} from '../../constant/settings-menu';

@Component({
  selector: 'hospitality-bot-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit {
  readonly settings = settingsMenuOptions;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  selectSetting(settingName: SettingOptions) {
    console.log(settingName);

    switch (settingName) {
      case SettingOptions.ROLES_AND_PERMISSION:
        this.router.navigate([
          `/pages/roles-permissions/${this.userService.getLoggedInUserId()}`,
        ]);
        break;
      case SettingOptions.NOTIFICATION:
        break;
      default:
        this.router.navigate([`/pages/settings/${settingName}`]);
        break;
    }
  }
}

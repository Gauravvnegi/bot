import { Component, OnInit } from '@angular/core';
import { CookiesSettingsService } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private cookiesSettingService: CookiesSettingsService) {}

  ngOnInit(): void {
    this.cookiesSettingService.initCookiesForPlatform();
  }
}

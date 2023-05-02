import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CookiesSettingsService } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-create-with-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private cookiesSettingService: CookiesSettingsService) {}

  ngOnInit(): void {
    this.cookiesSettingService.initCookiesForPlatform();
  }

  ngAfterViewInit(): void {
    this.cookiesSettingService.afterEmbeddedFrameView();
  }

  ngOnDestroy(): void {
    this.cookiesSettingService.onEmbeddedFrameViewDestroy();
  }
}

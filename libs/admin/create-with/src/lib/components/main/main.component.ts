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
    document
      .getElementsByClassName('router__wrapper')[0]
      ?.setAttribute('style', 'padding:0px');
  }

  ngOnDestroy(): void {
    document
      .getElementsByClassName('router__wrapper')[0]
      ?.removeAttribute('style');
  }
}

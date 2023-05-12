import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';
import { CookiesSettingsService } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-create-with-marketing-and-seo',
  templateUrl: './marketing-and-seo.component.html',
  styleUrls: ['./marketing-and-seo.component.scss'],
})
export class MarketingAndSeoComponent implements OnInit {
  isLoaded: boolean;
  onboardingUrl = `${environment.createWithUrl}/admin/marketing-seo`;

  constructor(private cookiesSettingService: CookiesSettingsService) {}

  ngOnInit(): void {
    this.cookiesSettingService.$isPlatformCookiesLoaded.subscribe((res) => {
      this.isLoaded = res;
    });
  }
}

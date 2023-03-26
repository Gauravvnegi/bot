import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@hospitality-bot/admin/environment';
import { CookiesSettingsService } from '@hospitality-bot/admin/shared';
import { SettingOptions, siteUrl } from '../../constant/settings-menu';

@Component({
  selector: 'hospitality-bot-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss'],
})
export class SiteSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoaded = false;
  onboardingUrl = `${environment.createWithUrl}${
    siteUrl[SettingOptions.BUSINESS_INFO]
  }`;

  constructor(
    private cookiesSettingService: CookiesSettingsService,
    private route: ActivatedRoute
  ) {
    const settingOption = this.route.snapshot.paramMap.get('settingOption');
    this.onboardingUrl = `${environment.createWithUrl}${siteUrl[settingOption]}`;
  }

  ngOnInit(): void {
    this.cookiesSettingService.$isPlatformCookiesLoaded.subscribe((res) => {
      this.isLoaded = res;
    });
  }

  ngAfterViewInit(): void {
    this.cookiesSettingService.afterEmbeddedFrameView();
  }

  ngOnDestroy(): void {
    this.cookiesSettingService.onEmbeddedFrameViewDestroy();
  }
}

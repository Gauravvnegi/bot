import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  CookiesSettingsService,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { environment } from '@hospitality-bot/admin/environment';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-create-with-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoaded: boolean;
  onboardingUrl: string;

  readonly urlMapping = [
    { name: ModuleNames.CREATE_WITH_DASHBOARD, path: '/admin/dashboard' },
    { name: ModuleNames.SEO_FRIENDLY, path: '/admin/marketing-seo' },
    { name: ModuleNames.PAGES, path: '/admin/page' },
    { name: ModuleNames.BLOG, path: '/admin/blog' },
  ];

  constructor(
    private cookiesSettingService: CookiesSettingsService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    const currentModuleRoute = this.routesConfigService.activeRouteConfig
      .submodule;

    this.urlMapping.forEach((item) => {
      if (
        this.routesConfigService.getRouteFromName(item.name) ===
        currentModuleRoute.shortPath
      ) {
        this.onboardingUrl = `${environment.createWithUrl}${item.path}`;
      }
    });

    this.cookiesSettingService.initCookiesForPlatform();
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

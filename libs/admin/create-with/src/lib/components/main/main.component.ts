import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { environment } from '@hospitality-bot/admin/environment';
import {
  CookiesSettingsService,
  ModuleNames,
} from '@hospitality-bot/admin/shared';

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

    //Settings
    {
      name: ModuleNames.BUSINESS_INFO,
      path: '/admin/dashboard/edit-business-info',
    },
    {
      name: ModuleNames.WEBSITE_SETTINGS,
      path: '/admin/website-settings',
    },
    {
      name: ModuleNames.ACCEPT_PAYMENTS,
      path: '/admin/onboard-payment',
    },
    {
      name: ModuleNames.LEGAL_POLICIES,
      path: '/admin/legal-policy',
    },
  ];

  constructor(
    private cookiesSettingService: CookiesSettingsService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    const currentModuleRoute = this.routesConfigService.activeRouteConfig
      .submodule;

    const additionalPathUrl = this.routesConfigService.getQueryValue(
      'redirect'
    );

    const [additionalPath, additionalPathParam] = additionalPathUrl.split('?');

    const productRoute = this.routesConfigService.activeRouteConfigSubscription
      .value.product.shortPath;

    this.urlMapping.forEach((item) => {
      if (
        this.routesConfigService.getRouteFromName(item.name) ===
        currentModuleRoute.shortPath
      ) {
        this.onboardingUrl = `${environment.createWithUrl}${
          item.path
        }/${additionalPath}?productPath=${productRoute}${
          additionalPathParam ? `&${additionalPathParam}` : ''
        }`;
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

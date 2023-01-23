import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { BlogComponent } from './components/blog/blog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { MarketingAndSeoComponent } from './components/marketing-and-seo/marketing-and-seo.component';
import { PagesComponent } from './components/pages/pages.component';
import { ThemeComponent } from './components/theme/theme.component';

const appRoutes: CRoutes = [
  {
    path: '',
    name: ModuleNames.CREATE_WITH,
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        name: ModuleNames.CREATE_WITH_DASHBOARD,
        component: DashboardComponent,
      },
      {
        path: 'marketing-seo',
        name: ModuleNames.SEO_FRIENDLY,
        component: MarketingAndSeoComponent,
      },
      {
        path: 'theme',
        name: ModuleNames.THEME,
        component: ThemeComponent,
      },
      {
        path: 'page',
        name: ModuleNames.PAGES,
        component: PagesComponent,
      },
      {
        path: 'blog',
        name: ModuleNames.BLOG,
        component: BlogComponent,
      },
      {
        path: 'booking-engine',
        name: ModuleNames.BOOKING_ENGINE,
        component: ComingSoonComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
  exports: [RouterModule],
})
export class AdminCreateWithRoutingModule {
  static components = [
    DashboardComponent,
    MainComponent,
    MarketingAndSeoComponent,
    ThemeComponent,
    PagesComponent,
    BlogComponent,
  ];
}

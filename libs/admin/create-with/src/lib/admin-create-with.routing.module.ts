import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { MarketingAndSeoComponent } from './components/marketing-and-seo/marketing-and-seo.component';
import { PagesComponent } from './components/pages/pages.component';
import { ThemeComponent } from './components/theme/theme.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'marketing-seo',
        component: MarketingAndSeoComponent,
      },
      {
        path: 'theme',
        component: ThemeComponent,
      },
      {
        path: 'page',
        component: PagesComponent,
      },
      {
        path: 'blog',
        component: BlogComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
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

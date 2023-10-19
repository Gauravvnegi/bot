import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { MarketingAndSeoComponent } from './components/marketing-and-seo/marketing-and-seo.component';
import { PagesComponent } from './components/pages/pages.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    // children: [
    //   {
    //     path: 'dashboard',
    //     name: ModuleNames.CREATE_WITH_DASHBOARD,
    //     component: MainComponent,
    //     children: [
    //       {
    //         path: '',
    //         name: ModuleNames.CREATE_WITH_DASHBOARD,
    //         component: DashboardComponent,
    //       },
    //       {
    //         path: '**',
    //         name: ModuleNames.CREATE_WITH_DASHBOARD,
    //         component: DashboardComponent,
    //       },
    //     ],
    //   },
    //   {
    //     path: 'marketing-seo',
    //     name: ModuleNames.SEO_FRIENDLY,
    //     component: MainComponent,
    //     children: [
    //       {
    //         path: '',
    //         name: ModuleNames.SEO_FRIENDLY,
    //         component: MarketingAndSeoComponent,
    //       },
    //       {
    //         path: '**',
    //         name: ModuleNames.SEO_FRIENDLY,
    //         component: MarketingAndSeoComponent,
    //       },
    //     ],
    //   },
    //   {
    //     path: 'page',
    //     name: ModuleNames.PAGES,
    //     component: MainComponent,
    //     children: [
    //       {
    //         path: '',
    //         name: ModuleNames.PAGES,
    //         component: PagesComponent,
    //       },
    //       {
    //         path: '**',
    //         name: ModuleNames.PAGES,
    //         component: PagesComponent,
    //       },
    //     ],
    //   },
    //   {
    //     path: 'blog',
    //     name: ModuleNames.BLOG,
    //     component: MainComponent,
    //     children: [
    //       {
    //         path: '',
    //         name: ModuleNames.BLOG,
    //         component: BlogComponent,
    //       },
    //       {
    //         path: '**',
    //         name: ModuleNames.BLOG,
    //         component: BlogComponent,
    //       },
    //     ],
    //   },
    //   {
    //     path: 'booking-engine',
    //     name: ModuleNames.BOOKING_ENGINE,
    //     component: MainComponent,
    //     children: [
    //       {
    //         path: '',
    //         name: ModuleNames.BOOKING_ENGINE,
    //         component: ComingSoonComponent,
    //       },
    //       {
    //         path: '**',
    //         name: ModuleNames.BOOKING_ENGINE,
    //         component: ComingSoonComponent,
    //       },
    //     ],
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminCreateWithRoutingModule {
  static components = [
    // Delete every component except Main (Other not in use)
    DashboardComponent,
    MainComponent,
    MarketingAndSeoComponent,
    PagesComponent,
    BlogComponent,
  ];
}

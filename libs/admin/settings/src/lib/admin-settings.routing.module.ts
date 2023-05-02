import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import { SiteSettingsComponent } from './components/site-settings/site-settings.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: SettingsMenuComponent,
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('@hospitality-bot/admin/subscription').then(
            (m) => m.AdminSubscriptionModule
          ),
      },
      {
        path: 'tax',
        loadChildren: () =>
          import('@hospitality-bot/admin/tax').then((m) => m.AdminTaxModule),
      },
      {
        path: ':settingOption',
        component: SiteSettingsComponent,
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminSettingsRoutingModule {
  static components = [MainComponent, SettingsMenuComponent];
}

import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  DashboardErrorComponent,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { LibraryComponent } from './components/library/library.component';

const appRoutes: CRoutes = [
  { path: '', pathMatch: 'full', redirectTo: 'package' },
  {
    path: 'package',
    name: ModuleNames.PACKAGES,
    loadChildren: () =>
      import('@hospitality-bot/admin/packages').then(
        (m) => m.AdminPackagesModule
      ),
  },
  {
    path: 'listing',
    name: ModuleNames.LISTING,
    loadChildren: () =>
      import('@hospitality-bot/admin/listing').then(
        (m) => m.AdminListingModule
      ),
  },
  {
    path: 'assets',
    name: ModuleNames.ASSET,
    loadChildren: () =>
      import('@hospitality-bot/admin/assets').then((m) => m.AdminAssetsModule),
  },
  {
    path: 'topic',
    name: ModuleNames.TOPIC,
    loadChildren: () =>
      import('@hospitality-bot/admin/topic').then((m) => m.AdminTopicModule),
  },
  {
    path: 'template',
    name: ModuleNames.TEMPLATE,
    loadChildren: () =>
      import('@hospitality-bot/admin/template').then(
        (m) => m.AdminTemplateModule
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: '404' },
  { path: '404', component: DashboardErrorComponent },
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
export class AdminLibraryRoutingModule {
  static components = [LibraryComponent];
}

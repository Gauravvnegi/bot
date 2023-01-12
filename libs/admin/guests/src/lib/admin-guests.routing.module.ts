import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { ChartsModule } from 'ng2-charts';
import {
  GuestComponent,
  GuestDatatableComponent,
  GuestDatatableModalComponent,
  GuestDocumentsStatisticsComponent,
  GuestPaymentsStatisticsComponent,
  SourceStatisticsComponent,
  StatisticsComponent,
  TypeGuestStatisticsComponent,
} from './components';

const appRoutes: CRoutes = [
  { path: '', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    name: ModuleNames.GUESTS_DASHBOARD,
    component: GuestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild([]), ChartsModule],
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
export class AdminGuestsRoutingModule {
  static components = [
    GuestComponent,
    StatisticsComponent,
    GuestDocumentsStatisticsComponent,
    GuestPaymentsStatisticsComponent,
    SourceStatisticsComponent,
    TypeGuestStatisticsComponent,
    GuestDatatableComponent,
    GuestDatatableModalComponent,
  ];
}

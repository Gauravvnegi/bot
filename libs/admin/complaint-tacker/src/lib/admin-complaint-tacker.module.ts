import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { ROUTES, Router, RouterModule } from '@angular/router';
import { ComplaintTrackerComponent } from './component/complaint-tracker/complaint-tracker.component';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';

const appRoutes: CRoutes = [
  {
    path: '',
    component: ComplaintTrackerComponent,
    name: ModuleNames.COMPLAINT_HOME,
    children: [
      {
        path: 'complaint-analytics',
        name: ModuleNames.COMPLAINT_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/request-analytics').then(
            (m) => m.AdminRequestAnalyticsModule
          ),
      },
      {
        path: 'complaint',
        name: ModuleNames.COMPLAINTS,
        loadChildren: () =>
          import('@hospitality-bot/admin/request').then(
            (m) => m.AdminRequestModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
  declarations: [ComplaintTrackerComponent],
})
export class AdminComplaintTackerModule {}

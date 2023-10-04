import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRoutes, ModuleNames } from '@hospitality-bot/admin/shared';
import { Router, RouterModule } from '@angular/router';
import { ComplaintTrackerComponent } from './component/complaint-tracker/complaint-tracker.component';

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
  imports: [CommonModule, RouterModule.forChild(appRoutes)],
  declarations: [ComplaintTrackerComponent],
})
export class AdminComplaintTackerModule {}

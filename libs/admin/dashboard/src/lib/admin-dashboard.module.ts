import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';

export const adminDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [],
  },
];

@NgModule({
  imports: [CommonModule, AdminSharedModule, RouterModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class AdminDashboardModule {}

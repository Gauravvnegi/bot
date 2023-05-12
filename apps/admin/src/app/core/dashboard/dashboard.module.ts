import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../theme/src';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, ThemeModule, DashboardRoutingModule],
})
export class DashboardModule {}

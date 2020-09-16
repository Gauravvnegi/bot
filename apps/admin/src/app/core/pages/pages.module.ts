import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './containers/pages/pages.component';
import { PagesRoutingModule } from './pages.routing.module';
import { ThemeModule } from '../theme/src';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminDashboardModule } from '@hospitality-bot/admin/dashboard';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    ThemeModule,
    AdminDashboardModule,
    PagesRoutingModule,
  ],
})
export class PagesModule {}

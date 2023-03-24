import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminSettingsRoutingModule } from './admin-settings.routing.module';
import { SiteSettingsComponent } from './components/site-settings/site-settings.component';

@NgModule({
  imports: [
    CommonModule,
    AdminSettingsRoutingModule,
    RouterModule,
    AdminSharedModule,
  ],
  declarations: [...AdminSettingsRoutingModule.components, SiteSettingsComponent],
})
export class AdminSettingsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminSettingsRoutingModule } from './admin-settings.routing.module';
import { SiteSettingsComponent } from './components/site-settings/site-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotelService } from './components/services/hotel.service';
import { BrandService } from './components/services/brand.service';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminSettingsRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    AdminSharedModule,
  ],
  providers: [HotelService, BrandService],
  declarations: [
    ...AdminSettingsRoutingModule.components,
    SiteSettingsComponent,
    NotificationSettingsComponent,
  ],
  exports: [NotificationSettingsComponent],
})
export class AdminSettingsModule {}

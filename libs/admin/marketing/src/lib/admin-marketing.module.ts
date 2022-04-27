import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMarketingRoutingModule } from './admin-marketing.routing.module';

@NgModule({
  imports: [CommonModule, AdminMarketingRoutingModule],
  declarations: [...AdminMarketingRoutingModule.components],
})
export class AdminMarketingModule {}

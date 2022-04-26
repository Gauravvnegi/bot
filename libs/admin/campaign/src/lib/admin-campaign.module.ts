import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCampaignRoutingModule } from './admin-campaign.routing.module';

@NgModule({
  imports: [CommonModule, AdminCampaignRoutingModule],
  declarations: [...AdminCampaignRoutingModule.components],
})
export class AdminCampaignModule {}

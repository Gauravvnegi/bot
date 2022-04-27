import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCampaignRoutingModule } from './admin-campaign.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { EmailService } from './services/email.service';

@NgModule({
  imports: [
    CommonModule,
    AdminCampaignRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminCampaignRoutingModule.components],
  providers: [EmailService],
})
export class AdminCampaignModule {}

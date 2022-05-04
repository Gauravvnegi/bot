import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCampaignRoutingModule } from './admin-campaign.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { EmailService } from './services/email.service';
import { CampaignService } from './services/campaign.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    AdminCampaignRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['campaign'])),
  ],
  declarations: [...AdminCampaignRoutingModule.components],
  providers: [EmailService, CampaignService],
})
export class AdminCampaignModule {}

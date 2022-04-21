import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListingRoutingModule } from './admin-listing.routing.module';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ListingService } from './services/listing.service';

@NgModule({
  imports: [
    CommonModule,
    AdminListingRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['listing'])),
  ],
  declarations: [...AdminListingRoutingModule.components],
  providers: [ListingService],
})
export class AdminListingModule {}
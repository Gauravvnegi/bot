import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAssetsRoutingModule } from './admin-assets.routing.module';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AdminAssetsRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['asset'])),
  ],
  declarations: [...AdminAssetsRoutingModule.components],
})
export class AdminAssetsModule {}

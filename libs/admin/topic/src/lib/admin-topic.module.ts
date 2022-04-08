import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTopicRoutingModule } from './admin-topic.routing.module';
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
    AdminTopicRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['topic'])),
  ],
  declarations: [...AdminTopicRoutingModule.components],
})
export class AdminTopicModule {}

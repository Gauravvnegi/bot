import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { AdminNotificationModule } from 'libs/admin/notification/src/lib/admin-notification.module';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminRequestRoutingModule } from './admin-request.routing.module';
import { RequestService } from './services/request.service';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    SharedMaterialModule,
    AdminRequestRoutingModule,
    CKEditorModule,
    AdminNotificationModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['request'])),
  ],
  declarations: [...AdminRequestRoutingModule.components],
  providers: [RequestService],
})
export class AdminRequestModule {}

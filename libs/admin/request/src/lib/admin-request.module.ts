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
import { RequestWrapperComponent } from './components/request-wrapper/request-wrapper.component';
import { ServiceItemService } from 'libs/admin/service-item/src/lib/services/service-item-datatable.service';

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
  exports: [RequestWrapperComponent],
  declarations: [...AdminRequestRoutingModule.components],
  providers: [RequestService],
})
export class AdminRequestModule {}

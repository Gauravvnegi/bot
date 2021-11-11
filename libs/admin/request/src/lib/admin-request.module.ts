import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminNotificationModule } from 'libs/admin/notification/src/lib/admin-notification.module';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminRequestRoutingModule } from './admin-request.routing.module';
import { RequestService } from './services/request.service';

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
  ],
  declarations: [...AdminRequestRoutingModule.components],
  providers: [RequestService],
})
export class AdminRequestModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { AdminNotificationRoutingModule } from './admin-notification.routing.module';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedMaterialModule,
    AdminNotificationRoutingModule,
    AdminSharedModule
  ],
  declarations: [NotificationComponent],
})
export class AdminNotificationModule {}

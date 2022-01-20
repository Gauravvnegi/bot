import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { NotificationComponent } from './components/notification/notification.component';
import { RequestService } from './services/request.service';
import { FeedbackNotificationComponent } from './components/feedback-notification/feedback-notification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    SharedMaterialModule,
    CKEditorModule,
  ],
  declarations: [NotificationComponent, FeedbackNotificationComponent],
  exports: [NotificationComponent],
  providers: [RequestService],
})
export class AdminNotificationModule {}

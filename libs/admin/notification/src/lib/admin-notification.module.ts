import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { NotificationComponent } from './components/notification/notification.component';
import { RequestService } from './services/request.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    SharedMaterialModule,
    CKEditorModule,
  ],
  declarations: [NotificationComponent],
  exports: [NotificationComponent],
  providers: [RequestService]
})
export class AdminNotificationModule {}

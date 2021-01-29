import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminRequestRoutingModule } from './admin-request.routing.module';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { RequestComponent } from './components/request/request.component';
import { RequestService } from './services/request.service';
import { AdminNotificationModule } from 'libs/admin/notification/src/lib/admin-notification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    SharedMaterialModule,
    AdminRequestRoutingModule,
    CKEditorModule,
    AdminNotificationModule
  ],
  declarations: [RequestComponent, RequestDataTableComponent],
  providers: [RequestService]
})
export class AdminRequestModule {}

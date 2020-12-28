import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminRequestRoutingModule } from './admin-request.routing.module';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RequestService } from './services/request.service';
import { RequestComponent } from './components/request/request.component';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    SharedMaterialModule,
    AdminReservationModule,
    AdminRequestRoutingModule,
    CKEditorModule,
  ],
  declarations: [RequestComponent, RequestDataTableComponent, NotificationComponent],
  providers: [RequestService]
})
export class AdminRequestModule {}

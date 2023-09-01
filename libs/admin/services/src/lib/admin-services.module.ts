import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminServicesRoutingModule } from './admin-services.routing.module';
import { ServicesService } from './services/services.service';
import { AdminLibraryModule } from '@hospitality-bot/admin/library';
import { AdminFeedbackModule } from '@hospitality-bot/admin/feedback';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminServicesRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminLibraryModule,
    AdminFeedbackModule,
    GlobalSharedModule
  ],
  declarations: [...AdminServicesRoutingModule.components],
  providers: [ServicesService],
})
export class AdminServicesModule {}

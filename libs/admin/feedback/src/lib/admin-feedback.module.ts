import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminFeedbackRoutingModule } from './admin-feedback.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    AdminFeedbackRoutingModule
  ],
  declarations: [...AdminFeedbackRoutingModule.components]
})
export class AdminFeedbackModule {}

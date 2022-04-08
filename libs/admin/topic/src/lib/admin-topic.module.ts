import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTopicRoutingModule } from './admin-topic.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminTopicRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminTopicRoutingModule.components],
})
export class AdminTopicModule {}

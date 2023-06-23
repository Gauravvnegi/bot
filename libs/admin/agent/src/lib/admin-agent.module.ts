import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminAgentRoutingModule } from './admin-agent.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    AdminAgentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminAgentRoutingModule.components],
})
export class AdminAgentModule {}

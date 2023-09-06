import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminAgentRoutingModule } from './admin-agent.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersListComponent } from './components/members-list/members-list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    AdminAgentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [MembersListComponent],
  declarations: [...AdminAgentRoutingModule.components],
})
export class AdminAgentModule {}

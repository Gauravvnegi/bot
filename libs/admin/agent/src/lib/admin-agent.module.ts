import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminAgentRoutingModule } from './admin-agent.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyListComponent } from './components/company-list/company-list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    AdminAgentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CompanyListComponent],
  declarations: [...AdminAgentRoutingModule.components],
})
export class AdminAgentModule {}

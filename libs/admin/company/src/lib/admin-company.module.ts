import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCompanyRoutingModule } from './admin-company.rotuing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from './services/company.service';

@NgModule({
  imports: [
    AdminCompanyRoutingModule,
    CommonModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminCompanyRoutingModule.components],
  providers: [CompanyService],
})
export class AdminCompanyModule {}

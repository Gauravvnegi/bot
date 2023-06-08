import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCompanyRoutingModule } from './admin-company.rotuing.module';

@NgModule({
  imports: [AdminCompanyRoutingModule, CommonModule],
  declarations: [...AdminCompanyRoutingModule.components],
})
export class AdminCompanyModule {}

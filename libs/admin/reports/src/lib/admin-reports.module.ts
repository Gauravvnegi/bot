import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminReportsRoutingModule } from './admin-reports.routing.module';

@NgModule({
  imports: [CommonModule, AdminReportsRoutingModule],
  declarations: [...AdminReportsRoutingModule.components],
})
export class AdminReportsModule {}

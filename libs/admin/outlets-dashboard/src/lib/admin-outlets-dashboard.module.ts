import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminOutletsDashboardRoutingModule } from './admin-outlets-dashboard.routing.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutletTableService } from './services/outlet-table.service';

@NgModule({
  imports: [
    CommonModule,
    AdminOutletsDashboardRoutingModule,
    AdminSharedModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminOutletsDashboardRoutingModule.components],
  providers: [OutletTableService],
})
export class AdminOutletsDashboardModule {}

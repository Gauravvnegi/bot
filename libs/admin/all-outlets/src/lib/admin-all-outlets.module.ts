import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminAllOutletsRoutingModule } from './admin-all-outlets.routing.module';
import { OutletService } from './services/outlet.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutletFormService } from './services/outlet-form.service';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    AdminAllOutletsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminAllOutletsRoutingModule.components],
  providers: [OutletService, OutletFormService],
})
export class AdminAllOutletsModule {}

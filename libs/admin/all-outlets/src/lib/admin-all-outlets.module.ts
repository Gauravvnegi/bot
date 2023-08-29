import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminAllOutletsRoutingModule } from './admin-all-outlets.routing.module';
import { OutletService } from './services/outlet.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutletFormService } from './services/outlet-form.service';
import { PageReloadService } from './services/page-reload.service.service';
import { TaxService } from 'libs/admin/tax/src/lib/services/tax.service';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    AdminAllOutletsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminAllOutletsRoutingModule.components],
  providers: [OutletService, OutletFormService, PageReloadService, TaxService],
})
export class AdminAllOutletsModule {}

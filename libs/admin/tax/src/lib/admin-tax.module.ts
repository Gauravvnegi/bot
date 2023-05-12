import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminTaxRoutingModule } from './admin-tax.routing.module';
import { TaxService } from './services/tax.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminTaxRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminTaxRoutingModule.components],
  providers: [TaxService],
})
export class AdminTaxModule {}

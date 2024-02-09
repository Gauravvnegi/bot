import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KotRoutingModule } from './kot-routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingItemSummaryComponent } from './components/pending-item-summary/pending-item-summary.component';
import { KotService } from './services/kot.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KotRoutingModule,
    AdminSharedModule,
    GlobalSharedModule,
  ],
  declarations: [...KotRoutingModule.components, PendingItemSummaryComponent],
  providers: [KotService],
})
export class AdminKotModule {}

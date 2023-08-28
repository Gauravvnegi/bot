import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { EntityTabFilterComponent } from './components/entity-tab-filter/entity-tab-filter.component';

@NgModule({
  imports: [CommonModule , AdminSharedModule],
  declarations: [EntityTabFilterComponent],
  exports: [EntityTabFilterComponent],
})
export class GlobalSharedModule {}

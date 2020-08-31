import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [CommonModule, TableModule],
  declarations: [DatatableComponent],
  exports: [DatatableComponent],
})
export class AdminSharedModule {}

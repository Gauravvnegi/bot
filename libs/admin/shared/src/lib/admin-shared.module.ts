import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button/';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule],
  declarations: [DatatableComponent],
  exports: [DatatableComponent],
})
export class AdminSharedModule {}

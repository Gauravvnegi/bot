import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button/';
import { PaginatorModule } from 'primeng/paginator';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@NgModule({
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule],
  declarations: [DatatableComponent, UploadFileComponent],
  exports: [DatatableComponent],
})
export class AdminSharedModule {}

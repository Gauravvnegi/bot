import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button/';
import { PaginatorModule } from 'primeng/paginator';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    TabMenuModule,
    DropdownModule,
  ],
  declarations: [DatatableComponent, TabGroupComponent, UploadFileComponent],
  exports: [DatatableComponent, TabGroupComponent, UploadFileComponent],
})
export class AdminSharedModule {}

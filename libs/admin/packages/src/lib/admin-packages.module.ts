import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { EditPackageComponent } from './components/edit-package/edit-package.component';
import { PackageService } from './services/package.service';
import { PackageDatatableComponent } from './components/package-datatable/package-datatable.component';
import { CategoriesDatatableComponent } from './components/categories-datatable/categories-datatable.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { AdminPackagesWrapperComponent } from './components/admin-packages-wrapper/admin-packages-wrapper.component';
import { CategoriesService } from './services/category.service';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { AdminPackagesRoutingModule } from './admin-packages.routing.module';

@NgModule({
  imports: [ 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule, 
    RouterModule,
    TableModule,
    SharedMaterialModule,
    DropdownModule,
    AdminPackagesRoutingModule
  ],
  declarations: [
    EditPackageComponent, 
    PackageDatatableComponent, 
    CategoriesDatatableComponent,
    AdminPackagesWrapperComponent,
    EditCategoryComponent
  ],
  providers: [
    PackageService,
    CategoriesService
  ]
})
export class AdminPackagesModule {}

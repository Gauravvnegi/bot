import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { PackageService } from './services/package.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriesService } from './services/category.service';
import { AdminPackagesRoutingModule } from './admin-packages.routing.module';
import { PackagesService } from './services/packages.service';
import { MainComponent } from './components/main/main.component';
import { AdminLibraryModule } from '@hospitality-bot/admin/library';
import { AdminSettingsModule } from '@hospitality-bot/admin/settings';

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
    AdminPackagesRoutingModule,
    AdminLibraryModule,
    AdminSettingsModule
  ],
  declarations: [...AdminPackagesRoutingModule.components],
  providers: [PackageService, CategoriesService, PackagesService],
})
export class AdminPackagesModule {}

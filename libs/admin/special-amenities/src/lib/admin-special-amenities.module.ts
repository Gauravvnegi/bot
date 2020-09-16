import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminSpecialAmenitiesRoutingModule } from './admin-special-amenities.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { EditSpecialAmenitiesComponent } from './components/special-amenities/edit-special-amenities.component';
import { SpecialAmenitiesService } from './services/special-amenities.service';
import { PackageDatatableComponent } from './components/package-datatable/package-datatable.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

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
    AdminSpecialAmenitiesRoutingModule
  ],
  declarations: [EditSpecialAmenitiesComponent, PackageDatatableComponent],
  providers: [
    SpecialAmenitiesService
  ]
})
export class AdminSpecialAmenitiesModule {}

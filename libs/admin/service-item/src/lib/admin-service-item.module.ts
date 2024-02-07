import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminServiceItemRoutingModule } from './admin-service-item-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceItemService } from './services/service-item-datatable.service';
import { CategoryDatatableComponent } from './components/category-datatable/category-datatable.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { CreateServiceItemComponent } from './components/create-service-item/create-service-item.component';
@NgModule({
  declarations: [
    ...AdminServiceItemRoutingModule.components,
    CategoryDatatableComponent,
    CreateCategoryComponent,
    CreateServiceItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AdminServiceItemRoutingModule,
    AdminSharedModule,
  ],
  providers: [ServiceItemService],
  exports: [CreateServiceItemComponent],
})
export class AdminServiceItemModule {}

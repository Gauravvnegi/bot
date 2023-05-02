import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminRolesAndPermissionsRoutingModule } from './admin-roles-and-permissions.routing.module';
import { UserPermissionDatatableComponent } from './components/user-permission-datatable/user-permission-datatable.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRolesAndPermissionsRoutingModule,
    AdminSharedModule,
    SharedMaterialModule,
  ],
  declarations: [
    ...AdminRolesAndPermissionsRoutingModule.components,
    UserPermissionDatatableComponent,
  ],
})
export class AdminRolesAndPermissionsModule {}

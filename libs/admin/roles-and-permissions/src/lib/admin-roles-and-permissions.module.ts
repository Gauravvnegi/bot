import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';

import { AdminRolesAndPermissionsRoutingModule } from './admin-roles-and-permissions.routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserPermissionDatatableComponent } from './components/user-permission-datatable/user-permission-datatable.component';
import { EditUserPermissionComponent } from './components/edit-user-permission/edit-user-permission.component';
import { AddUserPermissionComponent } from './components/add-user-permission/add-user-permission.component';
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
    ManagePermissionComponent,
    UserPermissionDatatableComponent,
    EditUserPermissionComponent,
    AddUserPermissionComponent,
  ],
})
export class AdminRolesAndPermissionsModule {}

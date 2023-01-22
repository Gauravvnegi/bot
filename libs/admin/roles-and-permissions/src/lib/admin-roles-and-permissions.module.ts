import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRolesAndPermissionsRoutingModule } from './admin-roles-and-permissions.routing.module';
import { AddUserPermissionComponent } from './components/add-user-permission/add-user-permission.component';
import { EditUserPermissionComponent } from './components/edit-user-permission/edit-user-permission.component';
import { UserPermissionDatatableComponent } from './components/user-permission-datatable/user-permission-datatable.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

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
    UserProfileComponent,
  ],
})
export class AdminRolesAndPermissionsModule {}

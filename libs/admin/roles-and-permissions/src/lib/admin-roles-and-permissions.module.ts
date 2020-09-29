import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { SharedMaterialModule } from 'libs/shared/material/src';

import { AdminRolesAndPermissionsRoutingModule } from './admin-roles-and-permissions.routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRolesAndPermissionsRoutingModule,
    SharedMaterialModule,
  ],
  declarations: [ManagePermissionComponent],
})
export class AdminRolesAndPermissionsModule {}

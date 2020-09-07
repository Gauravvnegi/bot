import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { AdminRolesAndPermissionsRoutingModule } from './admin-roles-and-permissions.routing.module';
@NgModule({
  imports: [CommonModule, AdminRolesAndPermissionsRoutingModule],
  declarations: [ManagePermissionComponent],
})
export class AdminRolesAndPermissionsModule {}

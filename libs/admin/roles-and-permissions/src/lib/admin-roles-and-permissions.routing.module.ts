import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: ManagePermissionComponent,
  },
  {
    path: ':id',
    component: ManagePermissionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRolesAndPermissionsRoutingModule {}

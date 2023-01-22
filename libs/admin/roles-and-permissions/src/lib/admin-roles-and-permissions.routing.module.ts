import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { UserPermissionDatatableComponent } from './components/user-permission-datatable/user-permission-datatable.component';
import { AddUserPermissionComponent } from './components/add-user-permission/add-user-permission.component';
import { EditUserPermissionComponent } from './components/edit-user-permission/edit-user-permission.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: ManagePermissionComponent,
    children: [
      {
        path: '',
        component: UserPermissionDatatableComponent,
      },
      {
        path: 'add-user',
        component: AddUserPermissionComponent,
      },
      {
        path: ':id',
        component: UserProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRolesAndPermissionsRoutingModule {}

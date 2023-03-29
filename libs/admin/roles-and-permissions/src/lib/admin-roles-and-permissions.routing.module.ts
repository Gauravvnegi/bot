import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: ManagePermissionComponent,
    children: [
      {
        path: '',
        component: DashboardErrorComponent,
      },
      {
        path: ':id',
        component: UserProfileComponent,
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRolesAndPermissionsRoutingModule {}

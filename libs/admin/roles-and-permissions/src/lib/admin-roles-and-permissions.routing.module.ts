import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { managePermissionRoutes, navRoute } from './constants/routes';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: managePermissionRoutes.userProfile.route,
        component: UserProfileComponent,
      },
      {
        path: managePermissionRoutes.addNewUser.route,
        component: UserProfileComponent,
      },
      {
        path: managePermissionRoutes.editUser.route,
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
export class AdminRolesAndPermissionsRoutingModule {
  static components = [UserProfileComponent, MainComponent];
}

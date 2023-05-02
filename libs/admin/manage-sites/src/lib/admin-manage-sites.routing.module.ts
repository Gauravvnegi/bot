import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ManageSiteDataTableComponent } from './components/manage-site-data-table/manage-site-data-table.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const adminManageSitesRoutes: Route[] = [
  {
    path: '',
    component: ManageSiteDataTableComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminManageSitesRoutes)],
  exports: [RouterModule],
})
export class AdminManageSitesRoutingModule {
  static components = [
    MainComponent,
    ManageSiteDataTableComponent,
    UserProfileComponent,
  ];
}

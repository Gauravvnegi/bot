import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';

const appRoutes: Route[] = [
  { path: '', redirectTo: 'package' },
  {
    path: 'package',
    loadChildren: () =>
      import('@hospitality-bot/admin/packages').then(
        (m) => m.AdminPackagesModule
      ),
  },
  {
    path: 'listing',
    loadChildren: () =>
      import('@hospitality-bot/admin/listing').then(
        (m) => m.AdminListingModule
      ),
  },
  {
    path: 'assets',
    loadChildren: () =>
      import('@hospitality-bot/admin/assets').then((m) => m.AdminAssetsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminLibraryRoutingModule {
  static components = [LibraryComponent];
}

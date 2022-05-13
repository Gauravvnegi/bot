import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
import { LoadGuard } from 'apps/admin/src/app/core/guards/load-guard';

const appRoutes: Route[] = [
  { path: '', redirectTo: 'package' },
  {
    path: 'package',
    loadChildren: () =>
      import('@hospitality-bot/admin/packages').then(
        (m) => m.AdminPackagesModule
      ),
    canActivate: [LoadGuard],
  },
  {
    path: 'listing',
    loadChildren: () =>
      import('@hospitality-bot/admin/listing').then(
        (m) => m.AdminListingModule
      ),
    canActivate: [LoadGuard],
  },
  {
    path: 'assets',
    loadChildren: () =>
      import('@hospitality-bot/admin/assets').then((m) => m.AdminAssetsModule),
    canActivate: [LoadGuard],
  },
  {
    path: 'topic',
    loadChildren: () =>
      import('@hospitality-bot/admin/topic').then((m) => m.AdminTopicModule),
    canActivate: [LoadGuard],
  },
  {
    path: 'template',
    loadChildren: () =>
      import('@hospitality-bot/admin/template').then(
        (m) => m.AdminTemplateModule
      ),
    canActivate: [LoadGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminLibraryRoutingModule {
  static components = [LibraryComponent];
}

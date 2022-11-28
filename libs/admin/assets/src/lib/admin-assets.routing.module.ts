import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AssetsComponent } from './components/assets/assets.component';
import { AssetDatatableComponent } from './components/datatable/asset-datatable/asset-datatable.component';
import { EditAssetComponent } from './components/edit-asset/edit-asset.component';

const appRoutes: Route[] = [
  { path: '', component: AssetsComponent },
  { path: 'create', component: EditAssetComponent },
  { path: 'edit/:id', component: EditAssetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminAssetsRoutingModule {
  static components = [
    AssetsComponent,
    AssetDatatableComponent,
    EditAssetComponent,
  ];
}

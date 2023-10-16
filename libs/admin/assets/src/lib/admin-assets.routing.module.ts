import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AssetsComponent } from './components/assets/assets.component';
import { AssetDatatableComponent } from './components/datatable/asset-datatable/asset-datatable.component';
import { EditAssetComponent } from './components/edit-asset/edit-asset.component';
import { assetsRoutes } from './constants/routes';

const appRoutes: Route[] = [
  { path: assetsRoutes.assets.route, component: AssetsComponent },
  { path: assetsRoutes.createAssets.route, component: EditAssetComponent },
  { path: assetsRoutes.editAssets.route, component: EditAssetComponent },
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

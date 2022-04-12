import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { CreateAssetsComponent } from './components/create-assets/create-assets.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AssetDatatableComponent } from "./components/datatable/asset-datatable/asset-datatable.component";

const appRoutes: Route[] = [
    {path: '', component:AssetsComponent}, 
    
      {path:'create', component:CreateAssetsComponent},
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule],
    declarations: [],
  })
  export class AdminAssetsRoutingModule {
    static components = [CreateAssetsComponent,AssetsComponent,AssetDatatableComponent];
  }
  
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { OutletGraphsComponent } from './components/outlet-graphs/outlet-graphs.component';
import { OutletsDataTableComponent } from './components/outlets-data-table/outlets-data-table.component';
import { MainComponent } from './components/main/main.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: OutletGraphsComponent,
      },
    ],
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminOutletsDashboardRoutingModule {
  static components = [
    MainComponent,
    OutletGraphsComponent,
    OutletsDataTableComponent,
  ];
}

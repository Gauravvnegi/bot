import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportsDataTableComponent } from './components/reports-data-table/reports-data-table.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ReportsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminReportsRoutingModule {
  static components = [
    MainComponent,
    ReportsComponent,
    ReportsDataTableComponent,
  ];
}

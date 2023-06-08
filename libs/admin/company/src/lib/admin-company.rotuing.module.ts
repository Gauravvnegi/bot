import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CompanyDataTableComponent } from './components/company-data-table/company-data-table.component';
import { MainComponent } from './components/main/main.component';

const adminCompanyRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: CompanyDataTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminCompanyRoutes)],
  exports: [RouterModule],
})
export class AdminCompanyRoutingModule {
  static components = [MainComponent, CompanyDataTableComponent];
}

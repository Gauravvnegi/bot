import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CompanyDataTableComponent } from './components/company-data-table/company-data-table.component';
import { MainComponent } from './components/main/main.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { companyRoutes } from './constants/route';

const adminCompanyRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: companyRoutes.company.route,
        component: CompanyDataTableComponent,
      },
      {
        path: companyRoutes.addCompany.route,
        component: AddCompanyComponent,
      },
      {
        path: `${companyRoutes.editCompany.route}/:id`,
        component: AddCompanyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminCompanyRoutes)],
  exports: [RouterModule],
})
export class AdminCompanyRoutingModule {
  static components = [
    MainComponent,
    CompanyDataTableComponent,
    AddCompanyComponent,
  ];
}

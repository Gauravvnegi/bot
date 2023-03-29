import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateTaxComponent } from './components/create-tax/create-tax.component';
import { MainComponent } from './components/main/main.component';
import { TaxDataTableComponent } from './components/tax-data-table/tax-data-table.component';
import { taxRoutes } from './constants/routes';

export const adminTaxRoutes: Route[] = [
  {
    path: taxRoutes.tax.route,
    component: MainComponent,
    children: [
      {
        path: '',
        component: TaxDataTableComponent,
      },
      {
        path: taxRoutes.createTax.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: CreateTaxComponent,
          },
          {
            path: ':id',
            component: CreateTaxComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminTaxRoutes)],
  exports: [RouterModule],
})
export class AdminTaxRoutingModule {
  static components = [
    CreateTaxComponent,
    MainComponent,
    TaxDataTableComponent,
  ];
}

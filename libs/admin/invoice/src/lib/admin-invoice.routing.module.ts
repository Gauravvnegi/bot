import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { MainComponent } from './components/main/main.component';
import { invoiceRoutes } from './constants/routes';

export const adminInvoiceRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: invoiceRoutes.createInvoice.route, // # /id
        component: InvoiceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminInvoiceRoutes)],
  exports: [RouterModule],
})
export class AdminInvoiceRoutingModule {
  static components = [MainComponent, InvoiceComponent];
}

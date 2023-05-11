import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { PreviewComponent } from './components/preview/preview.component';
import { MainComponent } from './components/main/main.component';
import { invoiceRoutes } from './constants/routes';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';

export const adminInvoiceRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: `${invoiceRoutes.createInvoice.route}/:id`,
        component: InvoiceComponent,
      },
      {
        path: `${invoiceRoutes.editInvoice.route}/:id`,
        component: InvoiceComponent,
      },
      {
        path: `${invoiceRoutes.createInvoice.route}/preview-invoice/:id`,
        component: PreviewComponent,
      },
      {
        path: `${invoiceRoutes.paymentHistory.route}/:id`,
        component: PaymentHistoryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminInvoiceRoutes)],
  exports: [RouterModule],
})
export class AdminInvoiceRoutingModule {
  static components = [MainComponent, InvoiceComponent, PreviewComponent, PaymentHistoryComponent];
}

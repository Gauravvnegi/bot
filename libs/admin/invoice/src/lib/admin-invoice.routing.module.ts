import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddDiscountComponent } from './components/add-discount/add-discount.component';
import { AddRefundComponent } from './components/add-refund/add-refund.component';
import { InvoiceHistoryDataTableComponent } from './components/invoice-history-data-table/invoice-history-data-table.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { MainComponent } from './components/main/main.component';
import { PreviewComponent } from './components/preview/preview.component';

export const adminInvoiceRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: InvoiceHistoryDataTableComponent,
      },
      {
        path: ':id',
        component: InvoiceComponent,
      },
      {
        path: 'preview-invoice/:id',
        component: PreviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminInvoiceRoutes)],
  exports: [RouterModule],
})
export class AdminInvoiceRoutingModule {
  static components = [
    MainComponent,
    InvoiceComponent,
    PreviewComponent,
    AddDiscountComponent,
    AddRefundComponent,
    InvoiceHistoryDataTableComponent,
  ];
}

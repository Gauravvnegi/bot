import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { TransactionHistoryDataTableComponent } from './components/transaction-history-data-table/transaction-history-data-table.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: TransactionHistoryDataTableComponent,
      },
      // {
      //   // Remove Invoice from here already moved to invoice module
      //   path: 'invoice',
      //   component: InvoiceHistoryDataTableComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminFinanceRoutingModule {
  static components = [MainComponent, TransactionHistoryDataTableComponent];
}

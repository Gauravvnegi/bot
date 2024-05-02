import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { TransactionHistoryDataTableComponent } from './components/transaction-history-data-table/transaction-history-data-table.component';
import { NewTestComponent } from './components/new-test/new-test.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: TransactionHistoryDataTableComponent,
      },
      {
        path: 'new-test',
        component: MainComponent,
        children: [
          {
            path: '',
            component: NewTestComponent
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminFinanceRoutingModule {
  static components = [MainComponent, TransactionHistoryDataTableComponent, NewTestComponent];
}

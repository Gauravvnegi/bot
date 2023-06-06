import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { InvoiceHistoryDataTableComponent } from './components/invoice-history-data-table/invoice-history-data-table.component';
import { TransactionHistoryDataTableComponent } from './components/transaction-history-data-table/transaction-history-data-table.component';

const appRoutes: CRoutes = [
  {
    path: '',
    name: ModuleNames.FINANCE,
    component: MainComponent,
    children: [
      {
        path: 'invoice',
        name: ModuleNames.INVOICE,
        component: InvoiceHistoryDataTableComponent
      },
      {
        path: 'transaction',
        name: ModuleNames.TRANSACTION,
        component: TransactionHistoryDataTableComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
  exports: [RouterModule],
})
export class AdminFinanceRoutingModule {
  static components = [MainComponent, InvoiceHistoryDataTableComponent, TransactionHistoryDataTableComponent ];
}

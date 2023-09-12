import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import {
  GuestComponent,
  GuestDatatableComponent,
  GuestDatatableModalComponent,
  GuestDocumentsStatisticsComponent,
  GuestPaymentsStatisticsComponent,
  GuestStatisticsComponent,
  SourceStatisticsComponent,
  TypeGuestStatisticsComponent,
} from './components';

const appRoutes: Route[] = [{ path: '', component: GuestComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes), ChartsModule],
  exports: [RouterModule],
})
export class AdminGuestDashboardRoutingModule {
  static components = [
    GuestComponent,
    GuestStatisticsComponent,
    GuestDocumentsStatisticsComponent,
    GuestPaymentsStatisticsComponent,
    SourceStatisticsComponent,
    TypeGuestStatisticsComponent,
    GuestDatatableComponent,
    GuestDatatableModalComponent,
  ];
}

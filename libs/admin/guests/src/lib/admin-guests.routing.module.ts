import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import {
  GuestComponent,
  GuestDatatableComponent,
  GuestDatatableModalComponent,
  GuestDocumentsStatisticsComponent,
  GuestPaymentsStatisticsComponent,
  SourceStatisticsComponent,
  StatisticsComponent,
  TypeGuestStatisticsComponent
} from './components';

const appRoutes: Route[] = [{ path: '', component: GuestComponent }];

@NgModule({
  imports: [RouterModule.forChild(appRoutes), ChartsModule],
  exports: [RouterModule],
})
export class AdminGuestsRoutingModule {
  static components = [
    GuestComponent,
    StatisticsComponent,
    GuestDocumentsStatisticsComponent,
    GuestPaymentsStatisticsComponent,
    SourceStatisticsComponent,
    TypeGuestStatisticsComponent,
    GuestDatatableComponent,
    GuestDatatableModalComponent,
  ];
}

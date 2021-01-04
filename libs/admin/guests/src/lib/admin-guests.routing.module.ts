import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { GuestComponent } from './components/guest/guest.component';
import { GuestDocumentsStatisticsComponent } from './components/guest-documents-statistics/guest-documents-statistics.component';
import { GuestPaymentsStatisticsComponent } from './components/guest-payments-statistics/guest-payments-statistics.component';
import { GuestStatusStatisticsComponent } from './components/guest-status-statistics/guest-status-statistics.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SourceStatisticsComponent } from './components/source-statistics/source-statistics.component';
import { ChartsModule } from 'ng2-charts';
import { TypeGuestStatisticsComponent } from './components/type-guest-statistics/type-guest-statistics.component';
import { GuestDatatableComponent } from './components/guest-datatable/guest-datatable.component';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { DetailsComponent } from './components/details/details.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: GuestComponent,
  },
];

@NgModule({
  imports: [
		RouterModule.forChild(appRoutes),
		ChartsModule,
	],
  exports: [RouterModule],
})
export class AdminGuestsRoutingModule {
  static components = [
	GuestComponent,
	StatisticsComponent,
	GuestDocumentsStatisticsComponent,
	GuestPaymentsStatisticsComponent,
	GuestStatusStatisticsComponent,
	SourceStatisticsComponent,
	TypeGuestStatisticsComponent,
	GuestDatatableComponent,
	DetailsComponent
  ];
}

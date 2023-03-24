import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateOfferComponent } from './components/create-offer/create-offer.component';
import { MainComponent } from './components/main/main.component';
import { OffersDataTableComponent } from './components/offers-data-table/offers-data-table.component';
import routes from './constant/routes';

export const adminOffersRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: OffersDataTableComponent,
      },
      {
        path: routes.createOffer,
        component: MainComponent,
        children: [
          {
            path: '',
            component: CreateOfferComponent,
          },
          {
            path: ':id',
            component: CreateOfferComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminOffersRoutes)],
  exports: [RouterModule],
})
export class AdminOffersRoutingModule {
  static components = [
    MainComponent,
    CreateOfferComponent,
    OffersDataTableComponent,
  ];
}

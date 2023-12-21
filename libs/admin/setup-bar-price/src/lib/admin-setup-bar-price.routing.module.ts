import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BarPriceComponent } from './components/bar-price/bar-price.component';
import { ExceptionComponent } from './components/exception/exception.component';
import { MainComponent } from './components/main/main.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { SetupBarPriceComponent } from './components/setup-bar-price/setup-bar-price.component';
import { BarPriceForm } from './components/bar-price-from/bar-price-form.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BarPriceComponent,
      },
      {
        path: 'create',
        component: SetupBarPriceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminSetupBarPriceRoutingModule {
  static components = [
    BarPriceComponent,
    MainComponent,
    ExceptionComponent,
    RoomTypesComponent,
    SetupBarPriceComponent,

    BarPriceForm,
  ];
}

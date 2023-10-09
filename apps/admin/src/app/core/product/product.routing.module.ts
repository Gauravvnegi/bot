import { NgModule } from '@angular/core';
import { ROUTES, Route, RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '../theme/src';
import { routeFactoryNew } from '../utils/routesFactory.module';
import { MainComponent } from './component/main/main.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'asd',
        component: MainComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) => {
        const routes = routeFactoryNew(appRoutes, [subscriptionService]);
        return routes;
      },
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
})
export class ProductRoutingModule {}

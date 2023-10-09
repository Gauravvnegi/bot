import { NgModule } from '@angular/core';
import { ROUTES, Route, RouterModule } from '@angular/router';
import { RoutesConfigService, SubscriptionPlanService } from '../theme/src';
import { routeFactoryNew } from '../utils/routesFactory.module';
import { MainComponent } from './component/main/main.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: MainComponent, // handle Redirection
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
      useFactory: (
        subscriptionService: SubscriptionPlanService,
        routesConfigService: RoutesConfigService
      ) => {
        const routes = routeFactoryNew(appRoutes, [
          subscriptionService,
          routesConfigService,
        ]);

        return routes;
      },
      multi: true,
      deps: [SubscriptionPlanService, RoutesConfigService],
    },
  ],
})
export class ProductRoutingModule {}

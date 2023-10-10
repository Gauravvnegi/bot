import { NgModule } from '@angular/core';
import { ROUTES, Route, RouterModule } from '@angular/router';
import { RoutesConfigService, SubscriptionPlanService } from '../theme/src';
import { routeFactoryNew } from '../utils/routesFactory.module';
import { MainComponent } from './component/main/main.component';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [],
  },
  { path: '**', redirectTo: '404' },
  {
    path: '404',
    component: DashboardErrorComponent,
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

        debugger;

        routes[0].children.push({ path: '**', redirectTo: '404' });
        routes[0].children.push({
          path: '404',
          component: DashboardErrorComponent,
        });

        return routes;
      },
      multi: true,
      deps: [SubscriptionPlanService, RoutesConfigService],
    },
  ],
})
export class ProductRoutingModule {}

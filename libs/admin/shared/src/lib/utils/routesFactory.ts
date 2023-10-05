import { Route, Routes } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { DashboardErrorComponent } from '../components/dashboard-error/dashboard-error.component';
import { ModuleNames, routes as defaultRoutes } from '../constants';

interface CRoute extends Route {
  name?: string;
  children?: CRoutes;
}

export type CRoutes = CRoute[];

export const routesFactory = (
  routes: CRoute[],
  deps: [SubscriptionPlanService],
  config = {}
): Routes => {
  let [subscriptionService] = deps;

  /**
   * @function deepCloneRoutes recursive function to get the children with with unsubscribed value
   * @param cRoutes current children value
   * @returns Routes
   */
  function deepCloneRoutes(cRoutes: CRoute[]): Routes {
    let firstSubscribedChild: string;

    const newChildren = cRoutes?.map((child) => {
      const { name, loadChildren, children, component, ...rest } = child;
      const isSubscribed = subscriptionService.checkModuleSubscription(
        name as ModuleNames
      );

      const productsConfig =
        subscriptionService.getModuleData(name)?.config ?? [];

      // getting the first subscribed sub module
      if (children && productsConfig) {
        let subscribedConfigsName = productsConfig
          .filter((item) => item.isSubscribed)
          .map((item) => item.name);

        let childrenNames = children.map((item) => item.name);

        firstSubscribedChild = subscribedConfigsName.find((item) =>
          childrenNames.includes(item)
        );
      }

      // check what will happens if main module is unsubscribed
      // than children will not be there
      const resChild: CRoute = {
        ...rest,
        loadChildren: isSubscribed
          ? loadChildren
          : () =>
              import('@hospitality-bot/admin/unsubscribed').then(
                (m) => m.AdminUnsubscribedModule
              ),
        children:
          children && isSubscribed ? deepCloneRoutes(children) : undefined,
        component: isSubscribed ? component : undefined,
      };

      return resChild;
    });

    // setting the redirect/error path based on child module subscription
    if (firstSubscribedChild) {
      const redirectUrl = defaultRoutes[firstSubscribedChild].split('/');

      const redirectRoute: Route = {
        path: '',
        pathMatch: 'full',
        redirectTo: redirectUrl[1],
      };

      // appending redirect route to front
      newChildren.unshift(redirectRoute);

      // appending error routes to last
      newChildren.push({ path: '**', pathMatch: 'full', redirectTo: '404' });
      newChildren.push({ path: '404', component: DashboardErrorComponent });
    }
    return newChildren;
  }

  const newRoutes = deepCloneRoutes(routes);

  return newRoutes;
};

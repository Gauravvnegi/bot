import { Route, Routes } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '../constants';

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
    const newChildren = cRoutes?.map((child) => {
      const { name, loadChildren, children, component, ...rest } = child;
      const isSubscribed = subscriptionService.checkModuleSubscription(
        name as ModuleNames
      );

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
        children: children ? deepCloneRoutes(children) : children,
        component: isSubscribed ? component : undefined,
      };

      return resChild;
    });

    return newChildren;
  }

  const newRoutes = deepCloneRoutes(routes);

  return newRoutes;
};

import { Route, Routes } from '@angular/router';
import { RouteModulesName } from 'libs/admin/shared/src/index';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';

interface SubscriptionConfig {
  config: SubscriptionConfig[];
  name: string;
  label: string;
  description: string;
  icon: string;
  isSubscribed: boolean;
  isView: boolean;
}

type ModulePromise<T extends any> = () => Promise<T>;

const moduleConfig: Record<RouteModulesName, any> = {
  // front desk
  ADD_RESERVATION: () =>
    import('@hospitality-bot/admin/manage-reservation').then(
      (m) => m.AdminManageReservationModule
    ),
  FRONT_DESK_DASHBOARD: () =>
    import('@hospitality-bot/admin/dashboard').then(
      (m) => m.AdminDashboardModule
    ),
  HOUSEKEEPING: () =>
    import('@hospitality-bot/admin/housekeeping').then(
      (m) => m.AdminHousekeepingModule
    ),

  //freddie
  CONVERSATION_DASHBOARD: () =>
    import('@hospitality-bot/admin/conversation-analytics').then(
      (m) => m.AdminConversationAnalyticsModule
    ),
  LIVE_MESSAGING: () => () =>
    import('@hospitality-bot/admin/messages').then(
      (m) => m.AdminMessagesModule
    ),
};

const UnsubscribedModule = () =>
  import('@hospitality-bot/admin/unsubscribed').then(
    (m) => m.AdminUnsubscribedModule
  );

const convertToRoute = (name) => {
  return name.toLowerCase().split('_').join('-');
};

export const routeFactoryNew = (
  routes: Routes,
  deps: [SubscriptionPlanService],
  config = {}
): Routes => {
  let [subscriptionService] = deps;

  const subscription = subscriptionService.getSubscription();

  const product: SubscriptionConfig[] = subscription.products;

  /**
   * Product Loop
   */
  product.forEach((product) => {
    const productName = product.name;
    if (productName && product.isView) {
      const productPath = convertToRoute(productName);

      /**
       * Module Loop
       */
      product.config.forEach((module) => {
        const moduleName = module.name;
        if (moduleName && module.isView) {
          const modulePath = convertToRoute(module.name);

          /**
           *Sub Module Loop
           */
          module.config.forEach((subModule) => {
            const subModuleName = subModule.name;

            if (subModuleName && subModule.isView) {
              const subModulePath = convertToRoute(subModule.name);
              const routeModule: Route = {
                path: `${productPath}/${modulePath}/${subModulePath}`,
                loadChildren: moduleConfig[subModuleName] ?? UnsubscribedModule,
              };

              routes[0].children.push(routeModule);
            }
          });
        }
      });
    }
  });

  return routes;
};

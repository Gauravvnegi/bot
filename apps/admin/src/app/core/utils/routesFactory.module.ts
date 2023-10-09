import { Route, Routes } from '@angular/router';
import { SubscriptionConfig } from 'libs/admin/shared/src/index';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { moduleConfig } from '../pages/config/config.module';
import { RoutesConfigService, SubscriptionPlanService } from '../theme/src';

type ModulePromise<T extends any> = () => Promise<T>;

const UnsubscribedModule = () =>
  import('@hospitality-bot/admin/unsubscribed').then(
    (m) => m.AdminUnsubscribedModule
  );

const getRedirectRouteConfig = (
  path: string,
  firstSubscribedChildrenPath: string,
  isSubscribed: boolean
) => {
  const moduleRouteConfig: Route = {
    path: path,
    redirectTo: isSubscribed ? firstSubscribedChildrenPath : undefined,
    loadChildren: isSubscribed ? undefined : UnsubscribedModule,
    component: firstSubscribedChildrenPath ? undefined : ComingSoonComponent,
    pathMatch: 'full',
  };

  return moduleRouteConfig;
};

export const routeFactoryNew = (
  routes: Routes,
  deps: [SubscriptionPlanService, RoutesConfigService],
  config = {}
): Routes => {
  let [subscriptionService, routesConfigService] = deps;

  const subscription = subscriptionService.getSubscription();

  const product: SubscriptionConfig[] = subscription.products;

  /**
   * Product Config Iteration
   */
  product.forEach((product) => {
    const productName = product.name;
    const isProductSubscribed = product.isSubscribed;
    const isProductInView = product.isView;

    if (productName && isProductInView) {
      const productRoute = routesConfigService.getRouteFromName(productName);

      var firstSubscribedModulePath = undefined;

      /**
       * Module Config Iteration
       */
      product.config.forEach((module) => {
        const moduleName = module.name;

        if (moduleName && module.isView) {
          const moduleRoute = routesConfigService.getRouteFromName(module.name);
          const modulePath = `${productRoute}/${moduleRoute}`;
          const isModuleSubscribed = module.isSubscribed;
          var firstSubscribedSubModulePath = undefined;

          // Getting first subscribed module path (Creating circular loop)
          // if (!firstSubscribedModulePath && isModuleSubscribed) {
          //   firstSubscribedModulePath = modulePath;
          // }

          /**
           * Sub Module Config Iteration
           */
          module.config.forEach((subModule) => {
            const subModuleName = subModule.name;
            const isSubModuleSubscribed = subModule.isSubscribed;
            const isSubModuleInView = subModule.isView;

            if (subModuleName && isSubModuleInView) {
              const subModuleRoute = routesConfigService.getRouteFromName(
                subModule.name
              );
              const subModulePath = `${productRoute}/${moduleRoute}/${subModuleRoute}`;

              // Getting first subscribed sub module path
              if (!firstSubscribedSubModulePath && isSubModuleSubscribed) {
                firstSubscribedSubModulePath = subModulePath;
              }

              if (
                // redirect to redirect wont work (creates loop to self route) that why full route even for product
                !firstSubscribedModulePath &&
                isModuleSubscribed &&
                isSubModuleSubscribed
              ) {
                firstSubscribedModulePath = subModulePath;
              }

              const loadSubModule = moduleConfig[subModuleName]; // Module Load
              const subModuleRouteConfig: Route = {
                path: subModulePath,
                loadChildren: isSubModuleSubscribed
                  ? loadSubModule
                  : UnsubscribedModule,
                component: loadSubModule ? undefined : ComingSoonComponent,
              };

              routes[0].children.push(subModuleRouteConfig);
            }
          });

          routes[0].children.push(
            getRedirectRouteConfig(
              modulePath,
              firstSubscribedSubModulePath,
              isModuleSubscribed
            )
          );
        }
      });

      routes[0].children.unshift(
        getRedirectRouteConfig(
          productRoute,
          firstSubscribedModulePath,
          isProductSubscribed
        )
      );
    }
  });

  return routes;
};

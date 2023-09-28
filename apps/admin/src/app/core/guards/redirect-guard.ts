import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { routes } from '@hospitality-bot/admin/shared';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';
import { AuthService } from '../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
  constructor(
    private subscriptionService: SubscriptionPlanService,
    private router: Router,
    private authService: AuthService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const subscription = this.subscriptionService.getSubscription();

    const selectedProduct = this.authService.getTokenByName('selectedProduct');
    
    let prioritySubscribedModuleName;

    const findSubscribedModule = (products) => {
      return products
        .find((item) => item.isSubscribed)
        ?.config.find((item) => item.isSubscribed)?.name;
    };

    if (selectedProduct) {
      const selectedProductData = subscription.products.find(
        (item) => item.name === selectedProduct
      );

      if (selectedProductData && selectedProductData.isSubscribed) {
        prioritySubscribedModuleName = findSubscribedModule([
          selectedProductData,
        ]);
      }
    } else {
      prioritySubscribedModuleName = findSubscribedModule(
        subscription.products
      );
    }
    const routeUrl = routes[prioritySubscribedModuleName];
    this.router.navigate([`pages/${routeUrl}`]);

    return true;
  }
}

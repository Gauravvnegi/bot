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
    const selectedProduct = this.subscriptionService.getSelectedProductData();

    if (selectedProduct.isSubscribed && selectedProduct.isView) {
      const currentConfig = selectedProduct.config;

      const firstSubscribedModuleName = currentConfig?.find(
        (item) => item.isSubscribed && item.isView
      )?.name;

      const firstViewModuleName = currentConfig?.find((item) => item.isView)
        ?.name;

      let prioritySubscribedModuleName =
        firstSubscribedModuleName ?? firstViewModuleName;

      if (prioritySubscribedModuleName) {
        const routeUrl = routes[prioritySubscribedModuleName];
        this.router.navigate([`pages/${routeUrl}`]);
      }
    }

    return true;
  }
}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { routes } from '@hospitality-bot/admin/shared';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
  constructor(
    private subscriptionService: SubscriptionPlanService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const subscription = this.subscriptionService.getSubscription();

    const prioritySubscribedModuleName = subscription?.products?.find(
      (item) => item.isSubscribed
    )?.name;
    const routeUrl = routes[prioritySubscribedModuleName];
    this.router.navigate([`pages/${routeUrl}`]);

    return true;
  }
}

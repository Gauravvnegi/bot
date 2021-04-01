import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class ModuleGuard implements CanActivate {
  constructor(
    private subscriptionService: SubscriptionPlanService,
    private router: Router,
    private location: Location
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const subscription = this.subscriptionService.getModuleSubscription();
    if (subscription && subscription.modules) {
      if (!subscription.modules[route.routeConfig.path].active) {
        this.location.back();
      }
      return subscription.modules[route.routeConfig.path].active;
    } else {
      this.location.back();
      return false;
    }
  }
}

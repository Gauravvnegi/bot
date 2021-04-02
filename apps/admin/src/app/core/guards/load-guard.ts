import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { ModuleSubscription } from '../theme/src/lib/data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class LoadGuard implements CanActivate {
  constructor(
    private _userDetailService: UserDetailService,
    private subscriptionService: SubscriptionPlanService,
    private location: Location
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let subscription = this.subscriptionService.getModuleSubscription();
    if (subscription === undefined) {
      debugger;
    } else if (subscription && subscription.modules) {
      if (!subscription.modules[route.routeConfig.path].active) {
        this.location.back();
      }
      return subscription.modules[route.routeConfig.path].active;
    } else {
      this.location.back();
      return false;
    }
  }

  validate(subscription, route): boolean {
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
function switchMap(arg0: (res: any) => any): any {
  throw new Error('Function not implemented.');
}

function forkJoin(arg0: { userDetail: any; subscription: any }) {
  throw new Error('Function not implemented.');
}

function of(res: any) {
  throw new Error('Function not implemented.');
}

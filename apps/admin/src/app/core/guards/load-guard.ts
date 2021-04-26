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
import { switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

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
      return this._userDetailService
        .getUserDetailsById(this._userDetailService.getLoggedInUserid())
        .pipe(
          switchMap((res) => {
            return forkJoin({
              userDetail: of(res),
              subscription: this.subscriptionService.getSubscriptionPlan(
                res.hotelAccess.chains[0].hotels[0].id
              ),
            });
          }),
          switchMap((response) => {
            return of(
              this.validate(
                new ModuleSubscription().deserialize(response?.subscription),
                route
              )
            );
          })
        );
    } else {
      return this.validate(subscription, route);
    }
  }

  validate(subscription, route): boolean {
    if (subscription && subscription.modules) {
      if (!subscription.modules[route.routeConfig.path].active) {
        this.goBack(route.routeConfig.path);
      }
      return subscription.modules[route.routeConfig.path].active;
    } else {
      this.goBack(route.routeConfig.path);
      return false;
    }
  }

  goBack(path) {
    if (path !== 'dashboard') this.location.back();
  }
}

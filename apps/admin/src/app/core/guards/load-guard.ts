import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';
import { UserService } from '@hospitality-bot/admin/shared';
import { ModuleSubscription } from '../theme/src/lib/data-models/subscription-plan-config.model';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { get } from 'lodash';

@Injectable({ providedIn: 'root' })
export class LoadGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private subscriptionService: SubscriptionPlanService,
    private location: Location,
    private _router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let subscription = this.subscriptionService.getModuleSubscription();
    if (subscription === undefined) {
      if (!this._userService.getLoggedInUserid()) {
        this._router.navigate(['/auth']);
        return false;
      }
      return this._userService
        .getUserDetailsById(this._userService.getLoggedInUserid())
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
        if (route.routeConfig.path === 'feedback') {
          return get(subscription, [
            'modules',
            'FEEDBACK_TRANSACTIONAL',
            'active',
          ]);
        }
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

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ModuleNames, UserService } from '@hospitality-bot/admin/shared';
import { get } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModuleSubscription } from '../theme/src/lib/data-models/subscription-plan-config.model';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';

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
      if (!subscription.modules[route.routeConfig.path]?.active) {
        if (route.routeConfig.path === 'feedback')
          return get(subscription, [
            'modules',
            ModuleNames.FEEDBACK_TRANSACTIONAL,
            'active',
          ]);
        else if (
          ['listing', 'topic', 'template'].includes(route.routeConfig.path)
        ){
          if( subscription.modules.marketing.active === false )
          {
            this._router.navigate(['/pages/404']);
            return;
          }
          else {
            return get(subscription, [
              'modules',
              ModuleNames.MARKETING,
              'active',
            ]);
          }
        }
        else if (route.routeConfig.path === 'assets')
          return (
            get(subscription, ['modules', ModuleNames.PACKAGES, 'active']) ||
            get(subscription, ['modules', ModuleNames.MARKETING, 'active'])
          );
        this.goBack(route.routeConfig.path);
      }
      return subscription.modules[route.routeConfig.path].active;
    } else {
      this.goBack(route.routeConfig.path);
      return false;
    }
  }

  goBack(path) {
    if (path !== ModuleNames.RESERVATION) this.location.back();
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoadingService } from '../../theme/src/lib/services/loader.service';
import { SubscriptionPlanService } from '../../theme/src/lib/services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class AdminDetailResolver implements Resolve<any> {
  constructor(
    private _userService: UserService,
    private _router: Router,
    private subscriptionPlanService: SubscriptionPlanService,
    private loadingService: LoadingService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this._userService.getLoggedInUserid()) {
      this._router.navigate(['/auth']);
    }
    this.loadingService.open();
    return this._userService
      .getUserDetailsById(this._userService.getLoggedInUserid())
      .pipe(
        switchMap((res) => {
          let subscription: Observable<any> = of(undefined);
          if (!this.subscriptionPlanService.getSubscription())
            subscription = this.subscriptionPlanService.getSubscriptionPlan(
              res.hotelAccess.chains[0].hotels[0].id
            );

          return forkJoin({
            userDetail: of(res),
            subscription,
          });
        })
      );
  }
}

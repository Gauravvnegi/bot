import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { switchMap } from 'rxjs/operators';
import { SubscriptionPlanService } from '../../theme/src/lib/services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class AdminDetailResolver implements Resolve<any> {
  constructor(
    private _userDetailService: UserDetailService,
    private _router: Router,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this._userDetailService.getLoggedInUserid()) {
      this._router.navigate(['/auth']);
    }
    return this._userDetailService
      .getUserDetailsById(this._userDetailService.getLoggedInUserid())
      .pipe(
        switchMap((res) => {
          return forkJoin({
            userDetail: of(res),
            subscription: this.subscriptionPlanService.getSubscriptionPlan(
              res.hotelAccess.chains[0].hotels[0].id
            ),
          });
        })
      );
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ManageSitesService } from '@hospitality-bot/admin/manage-sites';
import { HotelDetailService, UserService } from '@hospitality-bot/admin/shared';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoadingService } from '../../theme/src/lib/services/loader.service';
import { SubscriptionPlanService } from '../../theme/src/lib/services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class AdminDetailResolver implements Resolve<any> {
  constructor(
    private _userService: UserService,
    private _router: Router,
    private subscriptionPlanService: SubscriptionPlanService,
    private loadingService: LoadingService,
    private manageSite: ManageSitesService,
    private hotelDetailsService: HotelDetailService
  ) {}
  resolve(
    _route: ActivatedRouteSnapshot
  ): Observable<any> | Promise<any> | any {
    const userId = this._userService.getLoggedInUserId();
    const hotelId = this.hotelDetailsService.getHotelId();

    if (!userId) {
      this._router.navigate(['/auth']);
    }

    this.loadingService.open();
    return this._userService
      .getUserDetailsById(this._userService.getLoggedInUserId())
      .pipe(
        switchMap((res) => {
          if (hotelId) {
            const manageSiteList = this.manageSite.getSitesList(res.id);
            let subscription: Observable<any> = of(undefined);
            if (!this.subscriptionPlanService.getSubscription()) {
              subscription = this.subscriptionPlanService.getSubscriptionPlan(
                hotelId
              );
            }

            return forkJoin({
              userDetail: of(res),
              subscription,
              manageSiteList,
            });
          } else {
            this.loadingService.close();
            this._router.navigate(['/dashboard']);
            return of(false);
          }
        }),
        catchError((error) => {
          this.loadingService.close();
          return of(error);
        })
      );
  }
}

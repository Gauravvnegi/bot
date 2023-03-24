import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ManageSitesService } from '@hospitality-bot/admin/manage-sites';
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
    private loadingService: LoadingService,
    private manageSite: ManageSitesService
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
          const hasHotel = !!res.hotelAccess?.chains[0]?.hotels?.length;
          if (hasHotel) {
            const manageSiteList = this.manageSite.getSitesList(res.id);
            let subscription: Observable<any> = of(undefined);
            if (!this.subscriptionPlanService.getSubscription()) {
              const hotels = res.hotelAccess?.chains[0]?.hotels;
              subscription = this.subscriptionPlanService.getSubscriptionPlan(
                hotels[hotels.length - 1].id
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
        })
      );
  }
}

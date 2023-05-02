import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoadingService } from '../theme/src/lib/services/loader.service';
import { SubscriptionPlanService } from '../theme/src/lib/services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class CanLoadGuard implements CanLoad {
  constructor(
    private subscriptionService: SubscriptionPlanService,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  // can load will always return true (it is just use to get the subscription data if not present)
  canLoad(route: Route, segments: UrlSegment[]) {
    const subscription = this.subscriptionService.getSubscription();

    if (!subscription) {
      if (!this.userService.getLoggedInUserId()) {
        this.router.navigate(['/auth']);
        return false;
      }
      this.loadingService.open();

      return this.userService
        .getUserDetailsById(this.userService.getLoggedInUserId())
        .pipe(
          switchMap((res) => {
            const hotels = res.hotelAccess?.chains[0]?.hotels;
            const hasHotel = !!hotels?.length;
            if (hasHotel) {
              return this.subscriptionService.getSubscriptionPlan(
                hotels[hotels.length - 1].id
              );
            } else {
              this.loadingService.close();

              this.router.navigate(['/dashboard']);
              return of(false);
            }
          }),
          switchMap((response) => {
            this.subscriptionService.initSubscriptionDetails(response);
            this.loadingService.close();
            return of(true);
          })
        );
    }
    return true;
  }
}

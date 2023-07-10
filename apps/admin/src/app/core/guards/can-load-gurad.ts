import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { HotelDetailService, UserService } from '@hospitality-bot/admin/shared';
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
    private loadingService: LoadingService,
    private hotelDetailsService: HotelDetailService
  ) {}

  // can load will always return true (it is just use to get the subscription data if not present)
  canLoad(route: Route, segments: UrlSegment[]) {
    const subscription = this.subscriptionService.getSubscription();

    if (!subscription) {
      const userId = this.userService.getLoggedInUserId();
      const entityId = this.hotelDetailsService.getentityId();

      if (!userId) {
        this.router.navigate(['/auth']);
        return false;
      }

      if (!entityId) {
        this.router.navigate(['/dashboard']);
        return false;
      }

      this.loadingService.open();

      return this.subscriptionService.getSubscriptionPlan(entityId).pipe(
        switchMap((response) => {
          this.subscriptionService.initSubscriptionDetails(response);
          this.loadingService.close();
          return of(true);
        }),
      );
    }
    return true;
  }
}

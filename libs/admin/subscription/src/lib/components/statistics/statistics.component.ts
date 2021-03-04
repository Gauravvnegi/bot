import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { SubscriptionPlan } from '../../data-models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  $subscription = new Subscription();
  subscriptionPlan;
  globalQueries;

  constructor(
    private _globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private subscriptionService: SubscriptionService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        console.log(this.globalQueries);
        this.getSubscriptionPlan();
      })
    );
  }

  getSubscriptionPlan(): void {
    this.$subscription.add(
      this.subscriptionService
        .getSubscriptionPlan(this.globalQueries[0].hotelId)
        .subscribe(
          (response) => {
            this.subscriptionPlan = new SubscriptionPlan().deserialize(response);
            console.log(response);
          },
          ({ error }) => {
            this.snackBarService.openSnackBarAsText(error.message);
          }
        )
    );
  }
}

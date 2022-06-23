import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, BarChart } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../constants/chart';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'hospitality-bot-frontdesk-stat',
  templateUrl: './frontdesk-stat.component.html',
  styleUrls: ['./frontdesk-stat.component.scss'],
})
export class FrontdeskStatComponent implements OnInit {
  chart: BarChart = {
    data: [
      {
        fill: false,
        data: [''],
        label: 'Check-in',
      },
      {
        fill: false,
        data: [''],
        label: 'Check-Out',
      },
    ],
    labels: [''],
    options: chartConfig.options.frontdesk,
    colors: chartConfig.colors.frontdesk,
    legend: false,
    type: chartConfig.type.line,
  };
  $subscription = new Subscription();
  globalQueries = [];
  selectedInterval: string;
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private dateService: DateService,
    private subscriptionService: SubscriptionService,
    private _snackbarService: SnackBarService
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
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this._globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getChartData();
      })
    );
  }

  getChartData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.subscriptionService.getFrontdeskStats(config).subscribe(
        (resposne) => console.log(resposne),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

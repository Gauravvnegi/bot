import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { analytics } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { Notification } from '../../models/whatsapp-analytics.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  $subscription = new Subscription();
  globalFilters;
  hotelId: string;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  chart = analytics.notificationChart;
  stats: Notification;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.hotelId = this.globalFilterService.hotelId;
        this.getConversationData();
      })
    );
  }

  getConversationData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalFilters),
    };

    this.$subscription.add(
      this.analyticsService.getConversationTemplateStats(config).subscribe(
        (response) => {
          this.stats = new Notification().deserialize(response);
          this.initGraphData();
        },
        ({ error }) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  initGraphData() {
    this.chart.chartLabels = [];
    this.chart.chartData[0].data = [];
    this.chart.chartColors[0].backgroundColor = [];
    this.chart.chartColors[0].borderColor = [];

    this.stats.statistics.forEach((data) => {
      // if (data.count) {
      this.chart.chartLabels.push(data.label);
      this.chart.chartData[0].data.push(data.count);
      this.chart.chartColors[0].backgroundColor.push(data.color);
      this.chart.chartColors[0].borderColor.push(data.color);
      // }
    });
  }
  /**
   * @function legendOnClick To perform action on legend selection change.
   * @param index The selected legend index.
   */
  legendOnClick = (index, event) => {
    event.stopPropagation();
    const ci = this.baseChart.chart;
    const meta = ci.getDatasetMeta(0);
    if (!meta.data[index].hidden) {
      meta.data[index].hidden = true;
    } else {
      meta.data[index].hidden = false;
    }

    ci.update();
  };

  get colors() {
    return this.chart.chartColors[0].borderColor;
  }

  get labels() {
    return this.chart.chartLabels;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

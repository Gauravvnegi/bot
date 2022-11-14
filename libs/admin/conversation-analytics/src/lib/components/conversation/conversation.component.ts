import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { AdminUtilityService, analytics } from '@hospitality-bot/admin/shared';
import { Conversation } from 'libs/admin/request-analytics/src/lib/models/whatsapp-analytics.model';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';

@Component({
  selector: 'hospitality-bot-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  $subscription = new Subscription();
  globalFilters;
  hotelId: string;
  chart: any = analytics.chart;
  stats: Conversation;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId(this.globalFilters);
        this.getConversationData();
      })
    );
  }

  getConversationData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalFilters),
    };

    this.$subscription.add(
      this.analyticsService.getConversationMessageStats(config).subscribe(
        (response) => {
          this.stats = new Conversation().deserialize(response);
          this.initGraphData(
            this.stats.statistics.reduce(
              (accumulator, current) => accumulator + current.count,
              0
            ) === 0
          );
        },
        ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  initGraphData(defaultGraph = false) {
    if (defaultGraph) {
      this.chart.Labels = ['No Data'];
      this.chart.Data = [[100]];
      this.chart.Colors[0] = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      return;
    }
    this.chart.Labels = [];
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];

    this.stats.statistics.forEach((data) => {
      if (data.count) {
        this.chart.Labels.push(data.label);
        this.chart.Data[0].push(data.count);
        this.chart.Colors[0].backgroundColor.push(data.color);
        this.chart.Colors[0].borderColor.push(data.color);
      }
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { analytics } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import {
  IMessageOverallAnalytic,
  IMessageOverallAnalytics,
  ISentdeliveredChart,
  MessageOverallAnalytics,
  SentdeliveredChart,
} from '../../models/whatsapp-analytics.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-whatsapp-message-analytics',
  templateUrl: './whatsapp-message-analytics.component.html',
  styleUrls: ['./whatsapp-message-analytics.component.scss'],
})
export class WhatsappMessageAnalyticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  messageOverallAnalytics: IMessageOverallAnalytics;
  sentReceivedChartData: ISentdeliveredChart;
  hotelId: string;
  $subscription = new Subscription();

  legendData = analytics.whatsappLegendData;

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chart = analytics.whatsappChart;
  constructor(
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.getConversationStats();
        this.getSentReceivedChartData();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getConversationStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        { comparison: true },
      ]),
    };
    this.$subscription.add(
      this.analyticsService
        .getConversationStats(this.hotelId, config)
        .subscribe((response) => {
          this.messageOverallAnalytics = new MessageOverallAnalytics().deserialize(
            response.messageCounts
          );
        })
    );

    // this.messageOverallAnalytics = new MessageStat().deserialize(this.data.messageCounts);
  }

  getSentReceivedChartData() {
    this.$subscription.add(
      this.analyticsService
        .getSentReceivedStat(this.hotelId)
        .subscribe((response) => {
          this.sentReceivedChartData = new SentdeliveredChart().deserialize(
            response
          );
          this.initLineGraphData();
        })
    );
  }

  initLineGraphData() {
    this.chart.chartLabels = this.sentReceivedChartData.labels;
    this.chart.chartData[0].data = this.sentReceivedChartData.sent;
    this.chart.chartData[1].data = this.sentReceivedChartData.delivered;
  }

  legendOnClick = (index) => {
    let ci = this.baseChart.chart;
    let alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      let meta = ci.getDatasetMeta(i);

      if (i == index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    ci.update();
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

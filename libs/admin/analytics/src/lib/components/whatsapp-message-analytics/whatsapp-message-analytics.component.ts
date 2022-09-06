import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { analytics } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import {
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
export class WhatsappMessageAnalyticsComponent implements OnInit, OnDestroy {
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
    private globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.hotelId = this.globalFilterService.hotelId;
        this.getConversationStats();
        this.getSentReceivedChartData();
      })
    );
  }

  getConversationStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        { comparison: true },
      ]),
    };
    this.$subscription.add(
      this.analyticsService
        .getConversationStats(config)
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
  /**
   * @function legendOnClick To perform action on legend selection change.
   * @param index The selected legend index.
   */
  legendOnClick = (index) => {
    const ci = this.baseChart.chart;
    const alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      const meta = ci.getDatasetMeta(i);

      if (i === index) {
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

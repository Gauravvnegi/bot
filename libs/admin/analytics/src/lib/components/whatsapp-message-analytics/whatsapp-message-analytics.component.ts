import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
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

  legendData = [
    {
      label: 'Sent',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
    },
    {
      label: 'Delivered',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
    },
  ];

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chart: any = {
    chartData: [
      { data: [], label: 'Sent', fill: true },
      { data: [], label: 'Delivered', fill: true },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 4,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 5,
          hoverBorderWidth: 2,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 1,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#FFBF04',
        backgroundColor: '#FFC10780',
        pointBackgroundColor: '#FFBF04',
        pointBorderColor: '#ffffff',
      },
      {
        borderColor: '#52B33F',
        backgroundColor: '#31BB9280',
        pointBackgroundColor: '#52B33F',
        pointBorderColor: '#ffffff',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  constructor(
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.getConversationStats();
    this.getSentReceivedChartData();
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
    this.$subscription.add(
      this.analyticsService
        .getConversationStats(this.hotelId)
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
}

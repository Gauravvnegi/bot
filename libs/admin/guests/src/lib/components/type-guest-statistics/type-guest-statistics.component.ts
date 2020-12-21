import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { VIP } from '../../data-models/statistics.model';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-type-guest-statistics',
  templateUrl: './type-guest-statistics.component.html',
  styleUrls: ['./type-guest-statistics.component.scss']
})
export class TypeGuestStatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  selectedInterval: any;
  customerData: VIP = new VIP();
  $subscription = new Subscription();

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  legendData = [
    {
      label: 'Arrival',
      bubbleColor: '#FF9F67',
    },
    {
      label: 'In House',
      bubbleColor: '#30D8B6',
    },
    {
      label: 'Departure',
      bubbleColor: '#F25E5E',
    },
    {
      label: 'Out-Guest',
      bubbleColor: '#4A73FB',
    },
  ];

  chartTypes = [
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
  ];

  chart: any = {
    chartData: [
      { data: [20, 25, 22, 30, 27, 45], label: 'Arrival', fill: false },
      { data: [50, 65, 60, 75, 72, 80], label: 'In House', fill: false },
      { data: [20, 28, 24, 35, 29, 55], label: 'Departure', fill: false },
      { data: [50, 48, 60, 58, 65, 85], label: 'Out-Guest', fill: false },
    ],
    chartLabels: ['11 Jul', '25 Jul', '8 Aug', '22 Aug', '5 Sep', '19 Sep'],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0
        }
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
              stepSize: 25,
            },
          },
        ],
      },
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#FF9F67',
        backgroundColor: '#FF9F67'
      },
      {
        borderColor: '#30D8B6',
        backgroundColor: '#30D8B6'
      },
      {
        borderColor: '#F25E5E',
        backgroundColor: '#F25E5E'
      },
      {
        borderColor: '#4A73FB',
        backgroundColor: '#4A73FB'
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService
  ) { }

  ngOnInit(): void {
    this.getVIPStatistics();
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

  setChartType(option) {
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
    }
  }

  private initGraphData() {
    const botKeys = Object.keys(this.customerData.inHouse);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(
        this._adminUtilityService.convertTimestampToLabels(this.selectedInterval, d)
      );
      this.chart.chartData[0].data.push(this.customerData.arrival[d]);
      this.chart.chartData[1].data.push(this.customerData.inHouse[d]);
      this.chart.chartData[2].data.push(this.customerData.departure[d]);
      this.chart.chartData[3].data.push(this.customerData.outGuest[d]);
    });
  }

  

  private getVIPStatistics() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._adminUtilityService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        const config = {
          queryObj: this._adminUtilityService.makeQueryParams(queries),
        };
        this.$subscription.add(
          this._statisticService
            .getVIPStatistics(config)
            .subscribe((response) => {
              this.customerData = new VIP().deserialize(response);
              this.initGraphData();
            })
        );
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

}

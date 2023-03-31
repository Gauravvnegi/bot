import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../../constants/chart';
import { feedback } from '../../../../constants/feedback';
import { Disengagement } from '../../../../data-models/statistics.model';
import { StatisticsService } from '../../../../services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-disengagement',
  templateUrl: './disengagement.component.html',
  styleUrls: ['./disengagement.component.scss'],
})
export class DisengagementComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  disengagement: Disengagement;
  feedbackConfig = feedback;
  tabFeedbackType: string;
  selectedInterval: string;
  loading = false;
  globalQueries = [];
  total = 0;
  legends = [
    {
      label: 'GTM',
      borderColor: '#4b56c0',
    },
    {
      label: 'Closed',
      borderColor: '#c5c5c5',
    },
  ];
  circularGraph = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    Options: chartConfig.options.disengagement.doughnut,
  };

  circularTransparentGraph = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    Options: chartConfig.options.disengagement.transparentDoughnut,
  };

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);
  selectedDepartment = {
    key: '',
    index: 0,
    label: '',
  };
  $subscription = new Subscription();
  hotelId: string;
  constructor(
    private dateService: DateService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    protected statisticsService: StatisticsService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    if (
      this.globalFeedbackFilterType === feedback.types.transactional ||
      this.globalFeedbackFilterType === feedback.types.both
    )
      this.listenForOutletChanged();
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
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getHotelId(this.globalQueries);
        this.getGraphData();
      })
    );
  }

  getGraphData(status = true) {
    this.loading = status && true;
    this.$subscription.add(
      this.statisticsService
        .getDisengagementData({
          queryObj: this._adminUtilityService.makeQueryParams([
            ...this.globalQueries,
            {
              entityType: this.selectedDepartment.key,
              feedbackType: this.getFeedbackType(),
            },
          ]),
        })
        .subscribe(
          (response) => {
            this.disengagement = new Disengagement().deserialize(response);
            const index = this.disengagement.disengagementDrivers.findIndex(
              (item) => item.selected
            );
            this.selectedDepartment.index = index > 0 ? index : 0;
            this.total = this.disengagement.total;
            this.initGTMBreakdown(status && this.total > 0);
            this.initCircularGraphData();
            this.loading = false;
          },
          ({ error }) => {
            this.loading = false;
            this.snackbarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  getFeedbackType() {
    if (this.tabFeedbackType === undefined) {
      return this.globalFeedbackFilterType === this.feedbackConfig.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabFeedbackType === this.feedbackConfig.types.both
      ? feedback.types.transactional
      : this.tabFeedbackType;
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this.statisticsService.outletIds },
      ];
    else {
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: element.hotelId },
          ];
        }
      });
    }
  }

  listenForOutletChanged() {
    this.statisticsService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabFeedbackType = response.type;
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this.statisticsService.outletIds;
          }
        });
        this.getGraphData();
      }
    });
  }

  /**
   * @function getHotelId To get hotel id from the filter data.
   * @param globalQueries The filter list data.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  private initCircularGraphData(): void {
    if (this.disengagement.total) {
      this.circularGraph.Data[0] = [];
      this.circularGraph.Labels = [];
      this.circularGraph.Colors[0].backgroundColor = [];
      this.circularGraph.Colors[0].borderColor = [];
      this.circularTransparentGraph.Data[0] = [];
      this.circularTransparentGraph.Labels = [];
      this.circularTransparentGraph.Colors[0].backgroundColor = [];
      this.circularTransparentGraph.Colors[0].borderColor = [];
      this.disengagement.disengagementDrivers.forEach((item, index) => {
        this.circularGraph.Data[0].push(item.score);
        this.circularGraph.Labels.push(item.label);
        this.circularTransparentGraph.Data[0].push(item.score);
        this.circularTransparentGraph.Labels.push(item.label);
        if (index !== this.selectedDepartment.index) {
          this.circularGraph.Colors[0].backgroundColor.push(item.color);
          this.circularTransparentGraph.Colors[0].backgroundColor.push(
            'transparent'
          );
          this.circularTransparentGraph.Colors[0].borderColor.push(
            'transparent'
          );
          this.circularGraph.Colors[0].borderColor.push('transparent');
        } else {
          this.circularTransparentGraph.Colors[0].backgroundColor.push(
            this.disengagement.selectedItemColor
          );
          this.circularGraph.Colors[0].borderColor.push(
            this.disengagement.selectedItemColor
          );
          this.circularGraph.Colors[0].backgroundColor.push(
            this.disengagement.selectedItemColor
          );
        }
      });
    } else {
      this.resetGraph();
    }
  }

  private resetGraph() {
    this.circularGraph.Data[0] = [100];
    this.circularTransparentGraph.Data[0] = [100];
    this.circularGraph.Colors = [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ];
    this.circularTransparentGraph.Colors = [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ];
    this.circularGraph.Labels = ['No Data'];
    this.circularTransparentGraph.Labels = ['No Data'];
  }

  private initGTMBreakdown(status = true) {
    const obj = this.disengagement.disengagementDrivers[
      this.selectedDepartment.index
    ];
    if (status) this.selectedDepartment.key = obj?.key;
    this.selectedDepartment.label = obj?.label;
  }

  handleCircularGraphClick(e: any): void {
    if (e.event.type === 'click') {
      const clickedIndex = e.active[0]?._index;
      this.selectedDepartment.index = clickedIndex;
      this.initGTMBreakdown(true);
      this.getGraphData(false);
      this.initCircularGraphData();
    }
  }

  /**
   * @function legendOnClick To handle legend click for the graph.
   * @param index The index of the legend.
   */
  legendOnClick = (index) => {
    let chartRef = this.baseChart.chart;
    let alreadyHidden =
      chartRef.getDatasetMeta(index).hidden === null
        ? false
        : chartRef.getDatasetMeta(index).hidden;

    chartRef.data.datasets.forEach((error, i) => {
      let meta = chartRef.getDatasetMeta(i);

      if (i == index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    chartRef.update();
  };

  getPercentage(first: number, second: number) {
    return (first * 100) / (first + second);
  }
}

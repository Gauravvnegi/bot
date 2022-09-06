import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../../constants/chart';
import { feedback } from '../../../../constants/feedback';
import { StatisticsService } from '../../../../services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-disengagement',
  templateUrl: './disengagement.component.html',
  styleUrls: ['./disengagement.component.scss'],
})
export class DisengagementComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  disengagementData;
  feedbackConfig = feedback;
  tabfeedbackType: string;
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

  selectedDepartment;
  selectedDepartmentKey = 'RESERVATIONS';
  selectedDepartmentIndex = 0;
  $subscription = new Subscription();
  hotelId: string;
  deaprtmentList = [];
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
              entityType: this.selectedDepartmentKey,
              feedbackType: this.getFeedbackType(),
            },
          ]),
        })
        .subscribe(
          (response) => {
            this.disengagementData = response;
            if (status) {
              this.initCircularGraphData(response);
              this.initDepartments(response.departmenList);
            }
            this.initGTMBreakdown();
            this.loading = false;
          },
          ({ error }) => {
            this.loading = false;
            this.snackbarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  initDepartments(departmenList) {
    this.deaprtmentList = [];
    Object.keys(departmenList).forEach((key) =>
      this.deaprtmentList.push({ key, value: departmenList[key] })
    );
  }

  getFeedbackType() {
    if (this.tabfeedbackType === undefined) {
      return this.globalFeedbackFilterType === this.feedbackConfig.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabfeedbackType === this.feedbackConfig.types.both
      ? feedback.types.transactional
      : this.tabfeedbackType;
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
        this.tabfeedbackType = response.type;
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

  initCircularGraphData(data): void {
    if (data) {
      this.circularGraph.Data[0] = [];
      this.circularGraph.Labels = [];
      this.circularGraph.Colors[0].backgroundColor = [];
      this.circularGraph.Colors[0].borderColor = [];
      this.circularTransparentGraph.Data[0] = [];
      this.circularTransparentGraph.Labels = [];
      this.circularTransparentGraph.Colors[0].backgroundColor = [];
      this.circularTransparentGraph.Colors[0].borderColor = [];
      this.total = 0;
      Object.keys(data?.disengagmentDrivers).forEach((item, index) => {
        this.total += data?.disengagmentDrivers[item];
        this.circularGraph.Data[0].push(data?.disengagmentDrivers[item]);
        this.circularGraph.Labels.push(data?.departmenList[item]);
        this.circularTransparentGraph.Data[0].push(
          data?.disengagmentDrivers[item]
        );
        this.circularTransparentGraph.Labels.push(data?.departmenList[item]);
        if (index !== this.selectedDepartmentIndex) {
          this.circularGraph.Colors[0].backgroundColor.push(this.colors[index]);
          this.circularTransparentGraph.Colors[0].backgroundColor.push(
            'transparent'
          );
          this.circularTransparentGraph.Colors[0].borderColor.push(
            'transparent'
          );
          this.circularGraph.Colors[0].borderColor.push('transparent');
        } else {
          this.circularTransparentGraph.Colors[0].backgroundColor.push(
            this.selectedColor
          );
          this.circularGraph.Colors[0].borderColor.push(this.selectedColor);
          this.circularGraph.Colors[0].backgroundColor.push(this.selectedColor);
        }
      });
    }
  }

  initGTMBreakdown() {
    const selectedDepartmentKey = Object.keys(
      this.disengagementData.departmenList
    ).filter((item, i) => i == this.selectedDepartmentIndex)[0];
    this.selectedDepartment = this.disengagementData.departmenList[
      selectedDepartmentKey
    ];
  }

  handleCircularGraphClick(e: any): void {
    if (e.event.type === 'click') {
      const clickedIndex = e.active[0]?._index;
      this.selectedDepartmentIndex = clickedIndex;
      this.selectedDepartmentKey = Object.keys(
        this.disengagementData.departmenList
      ).filter((item, i) => i == clickedIndex)[0];
      this.selectedDepartment = this.disengagementData.departmenList[
        this.selectedDepartmentKey
      ];
      this.initCircularGraphData(this.disengagementData);
      this.getGraphData(false);
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

  colors = [
    '#b8bbbe',
    '#b2b7bc',
    '#99a6b5',
    '#909090',
    '#7e7e7e',
    '#696969',
    '#363636',
  ];
  selectedColor = '#4b56c0';
}

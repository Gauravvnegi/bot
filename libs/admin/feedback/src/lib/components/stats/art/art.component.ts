import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import {
  SnackBarService,
  ModalService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { ART, ARTGraph } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-art',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
})
export class ArtComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType;
  loading = false;
  tabfeedbackType: string;
  $subscription = new Subscription();
  feedbackConfig = feedback;
  globalQueries = [];
  chartData: ARTGraph;

  public chart = {
    datasets: [
      {
        data: [],
        label: 'Line',
        type: 'line',
        fill: false,
        borderColor: ['#000000'],
        backgroundColor: ['#000000'],
        tooltipHidden: false,
      },
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderColor: [],
        label: 'ART',
        tooltipHidden: false,
      },
    ],
    labels: [],
    options: chartConfig.options.art,
    legend: false,
  };
  constructor(
    protected statisticsService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    protected _modalService: ModalService
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getGraphData();
      })
    );
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

  getGraphData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };
    this.$subscription.add(
      this.statisticsService.getARTGraphData(config).subscribe((response) => {
        this.chartData = new ARTGraph().deserialize(response);
        if (this.chartData.data.length) this.loading = true;
        this.initChartData();
      })
    );
  }

  initChartData() {
    this.chart.datasets[0].data = [];
    this.chart.datasets[1].data = [];
    this.chart.datasets[1].backgroundColor = [];
    this.chart.datasets[1].borderColor = [];
    this.chart.datasets[1].hoverBackgroundColor = [];
    this.chart.labels = [];
    if (!this.chartData.data.length) {
      return;
    }
    this.loading = true;
    this.chart.datasets[0].data = [this.chartData.average];
    this.chart.datasets[1].data = [0];
    this.chart.labels = [''];
    this.chartData.data?.forEach((item: ART, index) => {
      if (index === 0) {
        this.chart.options.scales.xAxes[0].ticks.min = item.label;
        this.chart.datasets[1].backgroundColor.push(item.colorCode);
        this.chart.datasets[1].borderColor.push(item.colorCode);
        this.chart.datasets[1].hoverBackgroundColor.push(item.colorCode);
      }
      this.chart.datasets[0].data.push(this.chartData.average);
      this.chart.datasets[1].data.push(item.value);
      this.chart.datasets[1].backgroundColor.push(item.colorCode);
      this.chart.datasets[1].borderColor.push(item.colorCode);
      this.chart.datasets[1].hoverBackgroundColor.push(item.colorCode);
      this.chart.labels.push(item.label);
      if (index === this.chartData.data.length - 1) {
        this.chart.datasets[1].data.push(0);
        this.chart.datasets[0].data.push(this.chartData.average);
        this.chart.labels.push('');
        this.chart.options.scales.xAxes[0].ticks.max = item.label;
        this.chart.datasets[1].backgroundColor.push(item.colorCode);
        this.chart.datasets[1].hoverBackgroundColor.push(item.colorCode);
        this.chart.datasets[1].borderColor.push(item.colorCode);
        this.loading = false;
      }
    });
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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

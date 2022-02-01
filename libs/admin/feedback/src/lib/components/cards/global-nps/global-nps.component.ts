import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { GlobalNPS } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-global-nps',
  templateUrl: './global-nps.component.html',
  styleUrls: ['./global-nps.component.scss'],
})
export class GlobalNpsComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  @Input() hotelId;
  feedbackConfig = feedback;
  globalNps: GlobalNPS;
  color = feedback.colorConfig.globalNPS;
  labels = feedback.labels.globalNPS;

  chart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.type.doughnut,
    legend: false,
    colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    options: chartConfig.options.globalNPS,
  };

  loading: boolean = false;

  $subscription = new Subscription();
  globalQueries;

  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    if (
      this.globalFeedbackFilterType ===
        this.feedbackConfig.types.transactional ||
      this.globalFeedbackFilterType === this.feedbackConfig.types.both
    )
      this.listenForOutletChanged();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.setEntityId();
        this.getGlobalNps();
      })
    );
  }

  setEntityId() {
    if (this.globalFeedbackFilterType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this.statisticsService.outletIds },
      ];
    else if (this.globalFeedbackFilterType === feedback.types.both) {
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this.statisticsService.outletIds },
      ];
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('entityIds')) {
          element.entityIds.push(this.hotelId);
        }
      });
    } else {
      this.globalQueries = [...this.globalQueries, { entityIds: this.hotelId }];
    }
  }

  listenForOutletChanged() {
    this.statisticsService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this.statisticsService.outletIds;
          }
        });
        this.getGlobalNps();
      }
    });
  }

  /**
   * @function initGraphData Initializes the graph data.
   * @param data The global nps data.
   */
  initGraphData(data): void {
    this.chart.data[0].length = this.chart.labels.length = this.chart.colors[0].backgroundColor.length = this.chart.colors[0].borderColor.length = 0;
    Object.keys(data).map((key) => {
      if (
        key !== 'label' &&
        key !== 'score' &&
        key !== 'comparisonPercent' &&
        data[key].score
      ) {
        this.chart.labels.push(this.labels[key]);
        this.chart.data[0].push(this.roundValue(data[key].score));
        this.chart.colors[0].backgroundColor.push(this.color[key]);
        this.chart.colors[0].borderColor.push(this.color[key]);
      }
    });
    if (!this.chart.data[0].length) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => (this.chart.labels = [message]));
      this.chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
      this.chart.colors[0].borderColor.push(chartConfig.defaultColor);
      this.chart.data = [[100]];
    }
  }

  /**
   * @function getGlobalNps To get the global nps data.
   */
  getGlobalNps(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { feedbackType: this.globalFeedbackFilterType },
      ]),
    };
    this.statisticsService.getGlobalNPS(config).subscribe(
      (response) => {
        this.loading = false;
        this.globalNps = new GlobalNPS().deserialize(response);
        this.initGraphData(this.globalNps);
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }

  /**
   * @function roundValue To convert the fractional number to a round value.
   * @param data The fractional number.
   * @returns The round valued data.
   */
  roundValue(data): number {
    return data % 1 >= 0.5 ? Math.ceil(data) : Math.floor(data);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

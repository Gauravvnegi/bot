import { Component, Input, OnInit } from '@angular/core';
import { Bifurcation } from '../../../data-models/statistics.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
} from '@hospitality-bot/admin/shared';
import {
  SnackBarService,
  ModalService,
} from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { feedback } from '../../../constants/feedback';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { Subscription } from 'rxjs';
import { StatCard } from '../../../types/feedback.type';
import { chartConfig } from '../../../constants/chart';

@Component({
  selector: 'hospitality-bot-bifurcation-stats',
  templateUrl: './bifurcation-stats.component.html',
  styleUrls: ['./bifurcation-stats.component.scss'],
})
export class BifurcationStatsComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;

  feedback = [];
  stats: Bifurcation;
  bifurcationFG: FormGroup;
  noActionCount = 0;
  gtmCount = 0;
  entityType = 'GTM';
  tabFeedbackType: string;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  statCard: StatCard[] = [];

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
    options: chartConfig.options.feedback,
  };

  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected dateService: DateService,
    protected _translateService: TranslateService,
    protected _modalService: ModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG(): void {
    this.bifurcationFG = this.fb.group({
      bifurcation: ['ALL'],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
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
        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        )
          this.globalQueries = [
            ...this.globalQueries,
            {
              entityIds: this._statisticService.outletIds,
            },
          ];
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getStats();
      })
    );
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
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

  /**
   * @function getStats To get received feedback bifurcation data.
   */
  getStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
          entityType: 'ALL',
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService
        .getBifurcationStats(config)
        .subscribe((response) => {
          this.statCard = [];
          this.feedback = [];
          this.gtmCount = 0;
          this.stats = new Bifurcation().deserialize(response);
          this.stats.feedbacks.forEach((feedback) => {
            const newStatCard: StatCard = {
              label: feedback.label.replace(/\s+|-/g, ''),
              score: feedback.score.toString(),
              additionalData: feedback.score.toString(),
              comparisonPercent: 100,
              color: feedback.color,
            };
            if (feedback.label !== 'No-Action') {
              this.gtmCount += feedback.score;
              this.statCard.push(newStatCard);
            } else {
              this.noActionCount = +newStatCard.score;
              newStatCard.color = '#beaeff';
              this.feedback.push(newStatCard);
            }
          });
          this.feedback.push({
            label: 'GTM',
            score: this.gtmCount,
            additionalData: this.gtmCount,
            comparisonPercent: 100,
            color: '#5f38f9',
          });
          console.log(this.feedback);
          this.initGraph(
            this.feedback.reduce(
              (accumulator, current) => accumulator + +current.score,
              0
            ) === 0
          );
          // this.statCard = this.stats.feedbacks.map
        })
    );
  }

  initGraph(defaultGraph = true): void {
    this.chart.labels = [];
    this.chart.data = [[]];
    this.chart.colors = [
      {
        backgroundColor: [],
        borderColor: [],
      },
    ];
    console.log(defaultGraph);
    if (defaultGraph) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => this.chart.labels.push(message));
      this.chart.data[0].push(100);
      this.chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
      this.chart.colors[0].borderColor.push(chartConfig.defaultColor);
      return;
    }
    this.feedback.map((data) => {
      this.chart.labels.push(data.label);
      this.chart.data[0].push(data.score);
      this.chart.colors[0].backgroundColor.push(data.color);
      this.chart.colors[0].borderColor.push(data.color);
    });
  }

  getFeedbackType() {
    if (this.tabFeedbackType === undefined) {
      return this.globalFeedbackFilterType === feedback.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabFeedbackType === feedback.types.both
      ? ''
      : this.tabFeedbackType;
  }
}

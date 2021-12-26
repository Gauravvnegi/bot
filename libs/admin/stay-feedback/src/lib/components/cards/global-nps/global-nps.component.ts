import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { globalFeedback } from '@hospitality-bot/admin/feedback';
import {
  AdminUtilityService,
  CircularChart,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
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
  globalFeedbackConfig = globalFeedback;
  globalNps: GlobalNPS;
  color = feedback.colorConfig.globalNPS;
  labels = feedback.labels.globalNPS;

  defaultChart: CircularChart = {
    Labels: ['No Data'],
    Data: [[0]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: chartConfig.options.globalNPS,
  };

  chart: CircularChart = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: chartConfig.options.globalNPS,
  };

  loading: boolean = false;

  $subscription = new Subscription();
  globalQueries;

  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getGlobalNps();
      })
    );
  }

  /**
   * @function initGraphData Initializes the graph data.
   * @param data The global nps data.
   */
  initGraphData(data): void {
    this.chart.Data[0].length = this.chart.Labels.length = this.chart.Colors[0].backgroundColor.length = this.chart.Colors[0].borderColor.length = 0;
    Object.keys(data).forEach((key) => {
      if (
        key !== 'label' &&
        key !== 'score' &&
        key !== 'comparisonPercent' &&
        data[key].score
      ) {
        this.chart.Labels.push(this.labels[key]);
        this.chart.Data[0].push(this.roundValue(data[key].score));
        this.chart.Colors[0].backgroundColor.push(this.color[key]);
        this.chart.Colors[0].borderColor.push(this.color[key]);
      }
    });
    if (!this.chart.Data[0].length) {
      this.chart.Labels = ['No Data'];
      this.chart.Data = [[100]];
    }
  }

  /**
   * @function getGlobalNps To get the global nps data.
   */
  getGlobalNps(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService.getGlobalNPS(config).subscribe(
      (response) => {
        this.loading = false;
        this.globalNps = new GlobalNPS().deserialize(response);
        this.initGraphData(this.globalNps);
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
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
}

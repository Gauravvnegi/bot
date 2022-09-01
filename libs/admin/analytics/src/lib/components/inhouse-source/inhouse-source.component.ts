import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { analytics } from 'libs/admin/shared/src/lib/constants/charts';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { InhouseSource } from '../../models/statistics.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-inhouse-source',
  templateUrl: './inhouse-source.component.html',
  styleUrls: ['./inhouse-source.component.scss'],
})
export class InhouseSourceComponent implements OnInit, OnDestroy {
  @Input() entityType = 'Inhouse';
  @Input() requestConfiguration;
  $subscription = new Subscription();
  globalFilters;
  graphData;
  chart = analytics.inhouseSourceChart;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          { entityType: this.entityType },
        ];
        this.getInhouseSourceData();
      })
    );
  }

  getInhouseSourceData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalFilters),
    };

    this.$subscription.add(
      this.analyticsService.getSourceStats(config).subscribe(
        (response) => {
          this.graphData = new InhouseSource().deserialize(
            response,
            this.requestConfiguration
          );
          this.initGraphData();
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  private initGraphData(): void {
    this.chart.data = [[]];
    this.chart.labels = [];
    this.chart.colors[0].backgroundColor = [];
    this.chart.colors[0].borderColor = [];
    const keys = Object.keys(this.graphData.inhouseRequestSourceStats);
    keys.forEach((key, index) => {
      if (this.graphData.inhouseRequestSourceStats[key].value) {
        this.chart.data[0].push(
          this.graphData.inhouseRequestSourceStats[key].value
        );
        this.chart.labels.push(key);
        this.chart.colors[0].backgroundColor.push(
          this.getFilteredConfig(key).color
        );
        this.chart.colors[0].borderColor.push(
          this.getFilteredConfig(key).color
        );
      }
    });
    if (!this.chart.data[0].reduce((a, b) => a + b, 0)) {
      this.chart.data = [[100]];
      this.chart.colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      this.chart.labels = ['No data'];
    }
  }

  get stats() {
    if (this.graphData.inhouseRequestSourceStats)
      return Object.keys(this.graphData.inhouseRequestSourceStats);
    return [];
  }

  getFilteredConfig(label) {
    return this.requestConfiguration?.filter((d) => d.label === label)[0] || {};
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

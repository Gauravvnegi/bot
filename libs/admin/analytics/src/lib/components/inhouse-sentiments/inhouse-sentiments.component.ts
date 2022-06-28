import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { InhouseSentiments } from '../../models/statistics.model';
import { AnalyticsService } from '../../services/analytics.service';
import { analytics } from '@hospitality-bot/admin/shared';
import { InhouseRequestDatatableComponent } from '../inhouse-request-datatable/inhouse-request-datatable.component';

@Component({
  selector: 'hospitality-bot-inhouse-sentiments',
  templateUrl: './inhouse-sentiments.component.html',
  styleUrls: ['./inhouse-sentiments.component.scss'],
})
export class InhouseSentimentsComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  @Input() requestConfiguration;
  $subscription = new Subscription();
  globalFilters;
  selectedInterval: any;
  graphData;

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chart = analytics.inhouseSentimentChart;
  legendData = analytics.legendData;
  chartTypes = analytics.chartTypes;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService,
    private dateService: DateService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
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
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
          { entityType: 'Inhouse' },
        ];
        this.getInhouseSentimentsData();
      })
    );
  }

  getInhouseSentimentsData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalFilters),
    };

    this.$subscription.add(
      this.analyticsService.getSentimentsStats(config).subscribe(
        (response) => {
          this.graphData = new InhouseSentiments().deserialize(response);
          this.initGraphData();
        },
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  legendOnClick = (index, event) => {
    event.stopPropagation();
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

  setChartType(option, event): void {
    event.stopPropagation();
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
    }
  }

  private initGraphData(): void {
    const keys = Object.keys(this.graphData);
    this.chart.chartData = [];
    this.chart.chartLabels = [];
    this.chart.chartColors = [];
    keys.forEach((key) => {
      if (key !== 'label' && key !== 'totalCount') {
        if (!this.chart.chartLabels.length)
          this.initChartLabels(this.graphData[key].stats);
        this.chart.chartData.push({
          data: Object.values(this.graphData[key].stats),
          label: this.graphData[key].label,
          fill: false,
        });
        this.chart.chartColors.push({
          borderColor: this.getFilteredConfig(this.graphData[key].label).color,
          backgroundColor: this.getFilteredConfig(this.graphData[key].label)
            .color,
        });
      }
    });
  }

  initChartLabels(stat) {
    const keys = Object.keys(stat);
    keys.forEach((d, i) => {
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d,
          this._globalFilterService.timezone,
          this._adminUtilityService.getDateFormatFromInterval(
            this.selectedInterval
          ),
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalFilters)
            : null
        )
      );
    });
  }

  get stats() {
    if (this.graphData)
      return Object.keys(this.graphData).filter(
        (d) => d !== 'label' && d !== 'totalCount'
      );
    return [];
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      InhouseRequestDatatableComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'In-house Request';
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.optionLabels = [
      'Immediate',
      'Timeout',
      'Closed',
    ];
    detailCompRef.componentInstance.onModalClose.subscribe((res) =>
      // remove loader for detail close
      detailCompRef.close()
    );
  }

  getFilteredConfig(label) {
    return this.requestConfiguration?.filter((d) => d.label === label)[0] || {};
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

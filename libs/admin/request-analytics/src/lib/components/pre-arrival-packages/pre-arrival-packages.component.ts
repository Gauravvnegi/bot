import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { analytics } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { InhouseSentiments } from '../../models/statistics.model';
import { AnalyticsService } from '../../services/analytics.service';
import { PreArrivalDatatableComponent } from '../pre-arrival-datatable/pre-arrival-datatable.component';

@Component({
  selector: 'hospitality-bot-pre-arrival-packages',
  templateUrl: './pre-arrival-packages.component.html',
  styleUrls: ['./pre-arrival-packages.component.scss'],
})
export class PreArrivalPackagesComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  $subscription = new Subscription();
  globalFilters;
  selectedInterval: any;
  graphData;
  packageFG: FormGroup;
  @Input() entityType = 'pre-arrival';
  @Input() requestConfiguration;

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  legendData = analytics.legendData;
  chartTypes = analytics.chartTypes;
  chart = analytics.preArrivalChart;
  tabFilterItems = [];
  tabFilterIdx = 0;
  hotelId: string;

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService,
    private dateService: DateService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG() {
    this.packageFG = this.fb.group({
      chartType: ['line'],
    });
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
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };

        this.selectedInterval = calenderType.calenderType;
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.hotelId = this.globalFilterService.hotelId;
        if (!this.tabFilterItems.length) this.getPackageList();
        this.getInhouseSentimentsData();
      })
    );
  }

  getPackageList() {
    this.$subscription.add(
      this.analyticsService
        .getPackageList(this.hotelId)
        .subscribe((response) => {
          const packages = response.paidPackages || [];

          packages.forEach((item) => {
            if (item.active && item.packageCode)
              this.tabFilterItems.push({
                label: item.name,
                content: '',
                value: item.id,
                disabled: false,
                total: 0,
              });
          });
        })
    );
  }

  getInhouseSentimentsData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalFilters,
        {
          entityType: this.entityType,
          packageId: this.tabFilterItems[this.tabFilterIdx]?.value,
        },
      ]),
    };

    this.$subscription.add(
      this.analyticsService.getSentimentsStats(config).subscribe((response) => {
        this.graphData = new InhouseSentiments().deserialize(response);
        this.updatePackageCount(response.packageTotalCounts);
        this.initGraphData();
      })
    );
  }

  updatePackageCount(countObj) {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => (tab.total = countObj[tab.value]));
    }
  }

  /**
   * @function legendOnClick To perform action on legend selection change.
   * @param index The selected legend index.
   */
  legendOnClick = (index, event) => {
    event.stopPropagation();
    const ci = this.baseChart.chart;
    const alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      const meta = ci.getDatasetMeta(i);

      if (i === index) {
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
      if (!['label', 'totalCount', 'packageTotalCounts'].includes(key)) {
        if (!this.chart.chartLabels.length) {
          this.initChartLabels(this.graphData[key].stats);
        }
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
    keys.forEach((d, i) =>
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d,
          this.globalFilterService.timezone,
          this._adminUtilityService.getDateFormatFromInterval(
            this.selectedInterval
          ),
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalFilters)
            : null
        )
      )
    );
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.getInhouseSentimentsData();
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
      PreArrivalDatatableComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'Pre-arrival Request';
    detailCompRef.componentInstance.entityType = 'pre-arrival';
    detailCompRef.componentInstance.optionLabels = [
      'Accept',
      'Reject',
      'Closed',
      'Pending',
    ];
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.packageId = this.tabFilterItems[
      this.tabFilterIdx
    ]?.value;
    detailCompRef.componentInstance.onModalClose.subscribe((res) =>
      // remove loader for detail close
      detailCompRef.close()
    );
  }

  getFilteredConfig(label) {
    return this.requestConfiguration?.filter((d) => d.label === label)[0] || {};
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

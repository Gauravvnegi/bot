import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, BarChart } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../constants/chart';
import { FrontDeskGraph } from '../../data-models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'hospitality-bot-frontdesk-stat',
  templateUrl: './frontdesk-stat.component.html',
  styleUrls: ['./frontdesk-stat.component.scss'],
})
export class FrontdeskStatComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chart: BarChart = {
    data: [
      {
        fill: false,
        data: [''],
        label: 'Check-in',
      },
      {
        fill: false,
        data: [''],
        label: 'Check-Out',
      },
    ],
    labels: [''],
    options: {
      ...chartConfig.options.frontdesk,
      legendCallback: this.getLegendCallback,
    },
    colors: chartConfig.colors.frontdesk,
    legend: false,
    type: chartConfig.type.line,
  };
  $subscription = new Subscription();
  globalQueries = [];
  selectedInterval: string;
  entityId: string;
  graphData: FrontDeskGraph;
  constructor(
    private globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private dateService: DateService,
    private subscriptionService: SubscriptionService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
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
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.entityId = this.globalFilterService.entityId;
        this.getChartData();
      })
    );
  }

  getChartData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { entityIds: this.entityId },
      ]),
    };
    this.$subscription.add(
      this.subscriptionService.getFrontdeskStats(config).subscribe(
        (resposne) => {
          this.graphData = new FrontDeskGraph().deserialize(resposne);
          this.initGraphData();
        }
      )
    );
  }

  /**
   * @function initGraphData To initialize the graph data.
   */
  protected initGraphData(): void {
    this.chart.data[0].data = [];
    this.chart.data[1].data = [];
    this.chart.labels = [];
    this.graphData.checkIn.forEach((d, i) => {
      this.chart.labels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d.label,
          this.globalFilterService.timezone,
          this.getFormatForlabels(),
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      this.chart.data[0].data.push(d.value);
    });
    this.graphData.checkOut.forEach((d, i) =>
      this.chart.data[1].data.push(d.value)
    );
  }

  getFormatForlabels() {
    if (this.selectedInterval === 'date') return 'DD MMM';
    else if (this.selectedInterval === 'month') return 'MMM YYYY';
    return '';
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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

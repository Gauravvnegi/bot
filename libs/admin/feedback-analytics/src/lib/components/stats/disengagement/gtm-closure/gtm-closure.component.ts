import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../../constants/chart';
import { GtmClosureGraph } from '../../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-gtm-closure',
  templateUrl: './gtm-closure.component.html',
  styleUrls: ['./gtm-closure.component.scss'],
})
export class GtmClosureComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  @Input() department: string;
  @Input() data: GtmClosureGraph;
  @Input() selectedInterval: string;
  @Input() globalQueries;
  initialData: GtmClosureGraph;
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

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  lineGraph = {
    chartData: [
      { data: [], label: 'GTM', fill: false },
      { data: [], label: 'Closed', fill: false },
    ],
    chartLabels: [],
    chartOptions: {
      ...chartConfig.options.disengagement.line,
      legendCallback: this.getLegendCallback,
    },
    chartColors: chartConfig.colors.disengagement,
    chartLegend: false,
    chartType: chartConfig.type.line,
  };
  selectedDepartment;
  $subscription = new Subscription();
  entityId: string;
  constructor(
    private dateService: DateService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.initialData = this.data;
  }

  ngOnChanges() {
    if (this.data !== this.initialData) {
      this.initGTMClosureLineGraph();
      this.initialData = this.data; // Update previousData with the current data value
    }  }

  private initGTMClosureLineGraph() {
    if (this.data) {
      this.lineGraph.chartData[0].data = [];
      this.lineGraph.chartData[1].data = [];
      this.lineGraph.chartLabels = [];
      const dataKeys = Object.keys(this.data.closerGraph);
      dataKeys.forEach((key) => {
        this.lineGraph.chartLabels.push(
          this.dateService.convertTimestampToLabels(
            this.selectedInterval,
            key,
            this._globalFilterService.timezone,
            this._adminUtilityService.getDateFormatFromInterval(
              this.selectedInterval
            ),
            this.selectedInterval === 'week'
              ? this._adminUtilityService.getToDate(this.globalQueries)
              : null
          )
        );
        this.lineGraph.chartData[0].data.push(this.data.gtmGraph[key]);
        this.lineGraph.chartData[1].data.push(this.data.closerGraph[key]);
      });
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
}

import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { dashboardConfig } from '../../../constants/dashboard';
import { LegendData } from '../../../types/stats';

@Component({
  selector: 'hospitality-bot-comparison-graph',
  templateUrl: './comparison-graph.component.html',
  styleUrls: ['./comparison-graph.component.scss'],
})
export class ComparisonGraphComponent {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  _charts: typeof dashboardConfig.chart;
  @Input() title: string;
  @Input() legendData: LegendData[];
  @Input() loading = false;
  @Input('charts') set charts(chart: Partial<typeof dashboardConfig.chart>) {
    this._charts = { ...dashboardConfig.chart, ...chart };
  }

  constructor() {}

  get charts() {
    return { ...dashboardConfig.chart, ...this._charts };
  }

  /**
   * @function legendOnClick To perform action on legend selection change.
   * @param index The selected legend index.
   */
  legendOnClick = (index: number) => {
    const ci = this.baseChart.chart;
    const meta = ci.getDatasetMeta(index);
    meta.hidden = !meta.hidden;
    ci.update();
  };
}

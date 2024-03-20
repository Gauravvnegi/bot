import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DualPlotChartConfig,
  DualPlotFilterOptions,
  DualPlotGraphColor,
  DualPlotGraphDataset,
  DualPlotOptions,
} from '../../types/chart.type';
import { BaseChartDirective } from 'ng2-charts';

const GraphType = {
  LINE: 'line',
  BAR: 'bar',
} as const;
type GraphType = typeof GraphType[keyof typeof GraphType];

type ChartTypeConfig = {
  name: string;
  value: GraphType;
  url: string;
  backgroundColor: string;
};
const chartTypeConfig: ChartTypeConfig[] = [
  {
    name: 'Bar',
    value: GraphType.BAR,
    url: 'assets/svg/bar-graph.svg',
    backgroundColor: '#1AB99F',
  },
  {
    name: 'Line',
    value: GraphType.LINE,
    url: 'assets/svg/line-graph.svg',
    backgroundColor: '#DEFFF3',
  },
];
@Component({
  selector: 'hospitality-bot-dual-plot',
  templateUrl: './dual-plot.component.html',
  styleUrls: ['./dual-plot.component.scss'],
})
export class DualPlotComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  useForm: FormGroup;
  chartTypeOption = chartTypeConfig;

  @Input() graphType: GraphType = GraphType.LINE;
  @Input() isSwitchAble: boolean = false;
  @Input() label: string;
  @Input() icon: string;
  @Input() filterOptions: DualPlotFilterOptions;

  @Input() options: DualPlotOptions = defaultDualPlotOptions; //to customize graph design
  @Input() colors: DualPlotGraphColor[] = defaultDualPlotColors; //plotted graph colors
  @Input() datasets: DualPlotGraphDataset[] = []; //graph data

  @Input() set config(value: DualPlotChartConfig) {
    if (value) {
      Object.assign(this, value);
    }
  }

  DualPlotData: DualPlotChartConfig = {
    data: this.datasets,
    labels: [],
    options: this.options,
    colors: this.colors,
    legend: false,
    type: 'line' as any,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      graphType: [this.graphType],
    });
  }

  setChartType(config: ChartTypeConfig) {
    this.DualPlotData.type = config.value;
  }

  onFilterCLick(index: number) {
    const chart = this.baseChart.chart;

    const alreadyHidden =
      chart?.getDatasetMeta(index).hidden === null
        ? false
        : chart?.getDatasetMeta(index)?.hidden;

    chart?.data?.datasets?.forEach((data, idx) => {
      const meta = chart?.getDatasetMeta(idx);

      if (idx === index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    chart.update();
  }
}

const defaultDualPlotOptions: DualPlotOptions = {
  responsive: true,
  elements: {
    line: {
      tension: 0,
    },
    point: {
      radius: 4,
      borderWidth: 2,
      hitRadius: 5,
      hoverRadius: 5,
      hoverBorderWidth: 2,
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
        },
        ticks: {
          min: 0,
        },
      },
    ],
  },
  tooltips: {
    backgroundColor: 'white',
    bodyFontColor: 'black',
    borderColor: '#f4f5f6',
    borderWidth: 3,
    titleFontColor: 'black',
    titleMarginBottom: 5,
    xPadding: 10,
    yPadding: 10,
  },
};

const defaultDualPlotColors: DualPlotGraphColor[] = [
  {
    borderColor: '#0C8054',
    backgroundColor: '#DEFFF3',
    pointBackgroundColor: 'white',
    pointBorderColor: '#0C8054',
    pointHoverBackgroundColor: 'white',
    pointHoverBorderColor: '#0C8054',
  },
  {
    borderColor: '#ef1d45',
    backgroundColor: '#DEFFF3',
    pointBackgroundColor: 'white',
    pointBorderColor: '#ef1d45',
    pointHoverBackgroundColor: 'white',
    pointHoverBorderColor: '#ef1d45',
  },
];

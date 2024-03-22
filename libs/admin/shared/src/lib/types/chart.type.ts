export type CircularChart = {
  labels: string[];
  data: number[][];
  type: string;
  legend: false;
  colors: ChartColor[];
  options: any;
};

export type ChartColor = {
  backgroundColor?: string[];
  borderColor?: string[];
};

export type BarChart = {
  labels: string[];
  data: Bar[];
  type: string;
  legend: false;
  colors?: BarColor[];
  options: any;
};

export type BarColor = {
  borderColor?: string;
  backgroundColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
};

export type Bar = {
  data: any[];
  label: string;
  fill?: boolean;
  borderDash?: number[];
  backgroundColor?: string[];
  hoverBackgroundColor?: string[];
};

export type StatCard = {
  label: string;
  key?: string;
  score?: string | number;
  additionalData?: string | number;
  comparisonPercent?: number;
  color?: string;
  tooltip?: string;
};

type ChartData = {
  backgroundColor?: string[];
  borderColor?: string[];
  data: number[];
};

export type DualPlotFilterOptions = {
  label: string;
  color: string;
  icon: string;
};

export interface DualPlotOptions {
  responsive: boolean;
  elements: {
    line: {
      tension: number;
    };
    point: {
      radius: number;
      borderWidth: number;
      hitRadius: number;
      hoverRadius: number;
      hoverBorderWidth: number;
    };
  };
  scales: {
    xAxes: {
      gridLines: {
        display: boolean;
      };
    }[];
    yAxes: {
      gridLines: {
        display: boolean;
      };
      ticks: {
        min: number;
      };
    }[];
  };
  tooltips: {
    backgroundColor: string;
    bodyFontColor: string;
    borderColor: string;
    borderWidth: number;
    titleFontColor: string;
    titleMarginBottom: number;
    xPadding: number;
    yPadding: number;
  };
}

export interface DualPlotGraphColor {
  borderColor: string;
  backgroundColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
}

export type DualPlotDataset = {
  backgroundColor?: string;
  borderColor?: string;
  data: number[];
  label: string;
  fill: boolean;
} & Partial<DualPlotGraphColor>;

export interface DualPlotChartConfig {
  data: DualPlotDataset[];
  labels: string[];
  options: DualPlotOptions;
  colors: DualPlotGraphColor[];
  legend: boolean;
  type: 'line' | 'bar';
}

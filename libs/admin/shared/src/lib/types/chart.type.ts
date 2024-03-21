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

export type ChartOptions = {
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
    xAxes: Array<{ gridLines: { display: boolean } }>;
    yAxes: Array<{ gridLines: { display: boolean }; ticks: { min: number } }>;
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
};

type ChartColors = {
  borderColor: string;
  backgroundColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
};

type ChartConfigOptions = {
  nps: ChartOptions;
};

type ChartConfigColors = {
  nps: ChartColors[];
};

export type ChartConfigType = {
  options: ChartConfigOptions;
  colors: ChartConfigColors;
  type: {
    line: 'line';
    bar: 'bar';
  };
};

export type DualPlotChartConfig = {
  data: ChartData[];
  labels: string[];
  options: ChartOptions;
  colors: ChartColors[];
  legend: boolean;
  type: 'line' | 'bar';
};

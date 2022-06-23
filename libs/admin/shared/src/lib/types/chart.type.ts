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

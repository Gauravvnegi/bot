export type CircularChart = {
  Labels: string[];
  Data: number[][];
  Type: string;
  Legend: false;
  Colors: ChartColor[];
  Options: any;
};

export type ChartColor = {
  backgroundColor?: string[];
  borderColor?: string[];
};

export type BarChart = {
  Labels: string[];
  Data: Bar[];
  Type: string;
  Legend: false;
  Colors: BarColor[];
  Options: any;
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
  data: string[];
  label: string;
  fill?: boolean;
  borderDash?: number[];
};

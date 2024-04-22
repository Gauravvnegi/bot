import { ChartElementsOptions, ChartScales } from 'chart.js';

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
  id?: string;
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
  elements: ChartElementsOptions;
  scales: ChartScales;
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
  id?: string;
} & Partial<DualPlotGraphColor>;

export interface DualPlotChartConfig {
  data: DualPlotDataset[];
  labels: string[];
  options: DualPlotOptions;
  colors: DualPlotGraphColor[];
  legend: boolean;
  type: 'line' | 'bar';
}

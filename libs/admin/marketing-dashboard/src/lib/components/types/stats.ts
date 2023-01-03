import { dashboardConfig } from '../constants/dashboard';

export type LegendData = {
  label: string;
  borderColor: string;
  backgroundColor: string;
  dashed: boolean;
  src: string;
};

export type GraphStatsData = {
  label: string;
  primaryData: number;
  secondaryData: number;
};

export type GraphData = {
  title: string;
  chart: Partial<typeof dashboardConfig.chart>;
  legendData: LegendData[];
};

export type QueryConfig = {
  queryObj: string;
};

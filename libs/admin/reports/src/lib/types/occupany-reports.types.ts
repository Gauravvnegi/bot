import { HistoryAndForecastReportData } from '../models/occupancy-reports.models';
import { ManagerReportResponse } from './manager-reports.types';
import { RowStylesKeys } from './reports.types';

export type HistoryAndForecastColumns = Omit<
  HistoryAndForecastReportData,
  'deserialize' | RowStylesKeys
>;

export type HistoryAndForecastReportResponse = ManagerReportResponse & {
  subTotalObject: boolean;
};

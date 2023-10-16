import { HistoryAndForecastReportData } from '../models/occupancy-reports.models';
import { ManagerReportResponse } from './manager-reports.types';

export type HistoryAndForecastColumns = Omit<
  HistoryAndForecastReportData,
  'deserialize'
>;

export type HistoryAndForecastReportResponse = ManagerReportResponse & {
  subTotalObject: boolean;
};

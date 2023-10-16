import {
  DailyRevenueReportData,
  MonthlySummaryReportData,
} from '../types/financial-reports.types';
import { ReportClass } from '../types/reports.types';

export class MonthlySummaryReport
  implements ReportClass<MonthlySummaryReportData, any> {
  records: MonthlySummaryReportData[];
  deserialize(value: any[]) {
    // TODO - also remove any
    this.records = [{ todo: 'To-do' }];
    return this;
  }
}

export class DailyRevenueReport
  implements ReportClass<DailyRevenueReportData, any> {
  records: DailyRevenueReportData[];
  deserialize(value: any[]) {
    // TODO - also remove any
    this.records = [{ todo: 'To-do' }];
    return this;
  }
}

import { HistoryAndForecastReportData } from '../types/occupany-reports.types';
import { ReportClass } from '../types/reports.types';

export class HistoryAndForecastReport
  implements ReportClass<HistoryAndForecastReportData, any> {
  records: HistoryAndForecastReportData[];
  deserialize(value: any) {
    // TODO - also remove any
    this.records = [{ todo: 'To-do' }];
    return this;
  }
}

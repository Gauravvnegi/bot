import { ReportClass } from '../types/reports.types';
import { CashierReportData } from '../types/revenue-reports.types';

export class CashierReport implements ReportClass<CashierReportData, any> {
  records: CashierReportData[];
  deserialize(value: any) {
    // TODO - also remove any

    return this;
  }
}

import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { ReportClass } from '../types/reports.types';
import { CashierReportData } from '../types/revenue-reports.types';

export class CashierReport
  implements ReportClass<CashierReportData, ReservationResponseData> {
  records: CashierReportData[];
  deserialize(value: any) {
    return this;
  }
}

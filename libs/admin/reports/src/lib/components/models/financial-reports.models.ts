import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import {
  MonthlySummaryReportData,
  DailyRevenueReportData,
} from '../../types/financial-reports.types';
import { ReportClass } from '../../types/reports.types';

export class MonthlySummaryReport
  implements ReportClass<MonthlySummaryReportData, ReservationResponseData> {
  records: MonthlySummaryReportData[];
  deserialize(value: any) {
    return this;
  }
}

export class DailyRevenueReport
  implements ReportClass<DailyRevenueReportData, ReservationResponseData> {
  records: DailyRevenueReportData[];
  deserialize(value: any) {
    return this;
  }
}

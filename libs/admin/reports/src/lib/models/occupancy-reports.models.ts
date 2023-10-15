import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { HistoryAndForecastReportData } from '../types/occupany-reports.types';
import { ReportClass } from '../types/reports.types';

export class HistoryAndForecastReport
  implements
    ReportClass<HistoryAndForecastReportData, ReservationResponseData> {
  records: HistoryAndForecastReportData[];
  deserialize(value: any) {
    return this;
  }
}

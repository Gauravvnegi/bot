import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { ManagerFlashReportData } from '../types/manager-reports.types';
import { ReportClass } from '../types/reports.types';

export class ManagerFlashReport
  implements ReportClass<ManagerFlashReportData, ReservationResponseData> {
  records: ManagerFlashReportData[];
  deserialize(value: any) {
    return this;
  }
}

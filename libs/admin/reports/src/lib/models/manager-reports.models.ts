import { managerFlashReportRows } from '../constant/manager-reports.const';
import {
  ManagerFlashReportData,
  ManagerReportResponse,
} from '../types/manager-reports.types';
import { ReportClass } from '../types/reports.types';

/**
 * @class Default Manager Report class
 * Will be extended in every Manger report
 */
class MangerReport {}

export class ManagerFlashReport extends MangerReport
  implements ReportClass<ManagerFlashReportData, any> {
  records: ManagerFlashReportData[];
  deserialize(mangerReportData: ManagerReportResponse[]) {
    this.records = new Array<ManagerFlashReportData>();

    const dayData =
      mangerReportData.find((item) => item.calenderType === 'DAY') ?? {};
    const monthData =
      mangerReportData.find((item) => item.calenderType === 'MONTH') ?? {};
    const yearData =
      mangerReportData.find((item) => item.calenderType === 'YEAR') ?? {};

    managerFlashReportRows.forEach((item) => {
      this.records.push({
        emptyCell: item.label,
        day: dayData[item.name],
        year: yearData[item.name],
        month: monthData[item.name],
      });
    });

    return this;
  }
}

import { ManagerFlashReportData } from '../types/manager-reports.types';
import { ReportClass } from '../types/reports.types';

export class ManagerFlashReport
  implements ReportClass<ManagerFlashReportData, any> {
  records: ManagerFlashReportData[];
  deserialize(value: any) {
    // TODO - also remove any
    this.records = [{ todo: 'To-do' }];
    return this;
  }
}

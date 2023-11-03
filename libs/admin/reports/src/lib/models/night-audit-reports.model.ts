import { R } from '@angular/cdk/keycodes';
import {
  auditRoomDetailsReportRows,
  auditTaxReportRows,
} from '../constant/night-audit-reports.const';
import {
  AuditRoomDetailsReportData,
  AuditRoomDetailsReportResponse,
  AuditTaxReportData,
  AuditTaxReportResponse,
} from '../types/night-audit-reports.types';
import { ReportClass } from '../types/reports.types';

export class AuditRoomDetailsReport
  implements ReportClass<AuditRoomDetailsReportData, any> {
  records: AuditRoomDetailsReportData[];

  deserialize(value: AuditRoomDetailsReportResponse[]) {
    const data = value.find((item) => item?.calenderType === 'DAY') ?? {};

    this.records = new Array<AuditRoomDetailsReportData>();
    auditRoomDetailsReportRows.forEach((item) => {
      this.records.push({
        roomDetails: item.label,
        noOfRooms: data[item?.noOfRooms],
        noOfGuests: data[item?.noOfGuests],
      });
    });
    return this;
  }
}

export class AuditTaxReport implements ReportClass<AuditTaxReportData, any> {
  records: AuditTaxReportData[];

  deserialize(value: AuditTaxReportResponse) {
    this.records = new Array<AuditTaxReportData>();
    const totalTax = value?.totalCgstTax + value?.totalSgstTax;
    value = { ...value, totalTax };

    auditTaxReportRows.forEach((item) => {
      this.records.push({
        taxName: item.label,
        taxAmount: value[item?.name],
      });
    });

    return this;
  }
}

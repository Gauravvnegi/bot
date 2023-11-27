import { R } from '@angular/cdk/keycodes';
import {
  auditRoomDetailsReportRows,
  auditTaxReportRows,
  mtdAndYtdReportRows,
} from '../constant/night-audit-reports.const';
import {
  AuditRoomDetailsReportData,
  AuditRoomDetailsReportResponse,
  AuditTaxReportData,
  AuditTaxReportResponse,
  MtdAndYtdReportData,
  MtdAndYtdReportResponse,
} from '../types/night-audit-reports.types';
import { ReportClass } from '../types/reports.types';

export class AuditRoomDetailsReport
  implements ReportClass<AuditRoomDetailsReportData, any> {
  records: AuditRoomDetailsReportData[];

  deserialize(value: AuditRoomDetailsReportResponse[]) {
    this.records = new Array<AuditRoomDetailsReportData>();

    let data = value.find((item) => item?.calenderType === 'DAY');
    if (!data) return this;

    if (data?.totalRooms && data?.occupiedRooms) {
      const todayAvailableRooms = data?.totalRooms - data?.occupiedRooms;
      data = { ...data, todayAvailableRooms };
    }

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

export class AuditTaxReport
  implements ReportClass<AuditTaxReportData, AuditTaxReportResponse[]> {
  records: AuditTaxReportData[] = [];

  deserialize(value: AuditTaxReportResponse[]): this {
    const groupedData =
      value &&
      value.reduce((acc, item) => {
        const { type, amount } = item || {};

        if (type) {
          if (acc.has(type)) {
            acc.get(type).taxAmount += amount;
          } else {
            acc.set(type, { taxName: item?.type, taxAmount: item.amount });
          }
        }
        return acc;
      }, new Map<string, AuditTaxReportData>());

    let totalTaxAmount = 0;
    groupedData &&
      groupedData.forEach((item) => {
        totalTaxAmount += item.taxAmount;
      });

    this.records = [
      ...groupedData.values(),
      {
        taxName: 'Total Tax',
        taxAmount: totalTaxAmount,
        isBlackBg: true,
        isBold: true,
      },
    ];

    return this;
  }
}

//mtdAndYtdReport
export class MtdAndYtdReport
  implements ReportClass<MtdAndYtdReportData, MtdAndYtdReportResponse> {
  records: MtdAndYtdReportData[];

  deserialize(value: MtdAndYtdReportResponse[]) {
    value = value.map((item) => {
      const roomsOccupiedMinusOOSAndHouseUsePercentage =
        (item?.occupiedRooms /
          (item?.totalRooms - item?.houseUseRooms - item?.outOfServiceRooms)) *
        100;

      const roomsOccupiedMinusOOSPercentage =
        (item?.occupiedRooms / (item.totalRooms - item?.outOfServiceRooms)) *
        100;

      const roomsOccupiedMinusCompPercentage =
        item?.occupiedRooms -
        (item?.complimentaryRooms /
          (item?.totalRooms - item?.outOfServiceRooms)) *
          100;
      const totalRevenue = item?.roomRevenue + item?.inclusionOrAddOn;

      const occupiedRoomsExclHouseUse =
        item?.occupiedRooms - item?.houseUseRooms;
      const roomsOccupiedMinusComp =
        item?.occupiedRooms - item?.complimentaryRooms;

      const adrMinusComp =
        item?.roomRevenue / (item.occupiedRooms - item?.complimentaryRooms);
      const noOfLettableRooms = item.totalRooms - item.outOfServiceRooms;

      const availableRoom =
        item?.totalRooms - item?.outOfServiceRooms - item?.occupiedRooms;

      const revPAR = item.roomRevenue / item.totalRooms;

      return {
        ...item,
        roomsOccupiedMinusOOSAndHouseUsePercentage,
        roomsOccupiedMinusOOSPercentage,
        roomsOccupiedMinusCompPercentage,
        adrMinusComp,
        roomsOccupiedMinusComp,
        totalRevenue,
        occupiedRoomsExclHouseUse,
        noOfLettableRooms,
        availableRoom,
        revPAR,
      };
    });

    const dayData = value.find((item) => item?.calenderType === 'DAY') ?? {};
    const monthData =
      value.find((item) => item?.calenderType === 'MONTH') ?? {};
    const yearData = value.find((item) => item?.calenderType === 'YEAR') ?? {};
    this.records = new Array<MtdAndYtdReportData>();
    mtdAndYtdReportRows.forEach((item) => {
      this.records.push({
        name: item.name,
        day: dayData[item?.label],
        month: monthData[item?.label],
        year: yearData[item?.label],
      });
    });

    return this;
  }
}

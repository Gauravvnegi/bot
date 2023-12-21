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
  NightAuditRevenueData,
  NightAuditRevenueResponse,
} from '../types/night-audit-reports.types';
import { ReportClass } from '../types/reports.types';
import {
  convertToNormalCase,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';

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
        noOfRooms: data[item?.noOfRooms] ?? 0,
        noOfGuests: data[item?.noOfGuests] ?? 0,
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
        taxAmount: toCurrency(totalTaxAmount) as any,
        isSubTotal: true,
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
      const roomsOccupiedMinusOOSAndHouseUsePercentage = (
        (item?.occupiedRooms /
          Math.max(
            item?.totalRooms - item?.houseUseRooms - item?.outOfServiceRooms,
            1
          )) *
        100
      ).toFixed(2);

      const roomsOccupiedMinusOOSPercentage = (
        (item?.occupiedRooms /
          Math.max(item.totalRooms - item?.outOfServiceRooms, 1)) *
        100
      ).toFixed(2);

      const roomsOccupiedMinusCompPercentage = (
        (item?.occupiedRooms /
          Math.max(item?.totalRooms - item?.complimentaryRooms, 1)) *
        100
      ).toFixed(2);
      const totalRevenue = item?.roomRevenue + item?.inclusionOrAddOn;

      const occupiedRoomsExclHouseUse =
        item?.occupiedRooms - item?.houseUseRooms;
      const roomsOccupiedMinusComp =
        item?.occupiedRooms - item?.complimentaryRooms;

      const adrMinusComp = (
        item?.roomRevenue /
        Math.max(item.occupiedRooms - item?.complimentaryRooms, 1)
      ).toFixed(2);

      const noOfLettableRooms = item.totalRooms - item.outOfServiceRooms;

      const availableRooms =
        (item?.totalRooms ?? 0) -
        (item?.outOfServiceRooms ?? 0) -
        (item?.occupiedRooms ?? 0);

      const revPAR = (item.roomRevenue / Math.max(item.totalRooms, 1)).toFixed(
        2
      );

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
        availableRooms,
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

//nightAuditRevenue
export class NightAuditRevenueReport
  implements ReportClass<NightAuditRevenueData, NightAuditRevenueResponse> {
  records: NightAuditRevenueData[];

  deserialize(value: NightAuditRevenueResponse) {
    this.records = new Array<NightAuditRevenueData>();

    debugger;

    //first table
    this.records.push({
      firstCol: 'Revenue List',
      secondCol: 'Amount',
      thirdCol: ' ',
      fourthCol: ' ',
      fifthCol: ' ',
      isHeader: true,
    } as any);

    const revenueListData = value?.auditData;
    revenueListData
      ? revenueListRows.forEach((row) => {
          this.records.push({
            firstCol: row?.label,
            secondCol: revenueListData[row?.name],
            thirdCol: ' ',
            fourthCol: ' ',
            fifthCol: ' ',
          });
        })
      : this.records.push(empty);

    //second table
    this.records.push({
      firstCol: 'Inclusion Name',
      secondCol: 'Quantity',
      thirdCol: 'Total Price',
      fourthCol: 'Total Tax',
      fifthCol: 'Amount',
      isHeader: true,
    } as any);

    value?.itemPayments?.length
      ? value?.itemPayments.forEach((data) => {
          this.records.push({
            firstCol: data.description,
            secondCol: data.quantity,
            thirdCol: toCurrency(null),
            fourthCol: toCurrency(data?.totalTaxAmount),
            fifthCol: toCurrency(data?.amount),
          });
        })
      : this.records.push(empty);

    //third table
    this.records.push({
      firstCol: ' ',
      secondCol: 'Booking Revenue',
      thirdCol: 'Amount',
      fourthCol: ' ',
      fifthCol: ' ',
      isHeader: true,
    } as any);

    value?.bookingRevenue
      ? Object.keys(value?.bookingRevenue).forEach((key) => {
          const data = value?.bookingRevenue[key];

          this.records.push({
            firstCol: ' ',
            secondCol: convertToNormalCase(key),
            thirdCol: data,
            fourthCol: ' ',
            fifthCol: ' ',
          });
        })
      : this.records.push({ ...empty });

    return this;
  }
}

const revenueListRows = [
  { label: 'Room Revenue(Excluding Tax)', name: 'roomRevenue' },
  { label: 'Cancellation Charge', name: 'cancellationCharge' },
  { label: 'No Shows Revenue', name: 'noShowReservationAmount' },
  { label: 'Add Ons', name: 'addOns' },
];

const empty = {
  firstCol: undefined,
  secondCol: undefined,
  thirdCol: undefined,
  fourthCol: undefined,
  fifthCol: undefined,
};

import { dailyRevenueReportRows } from '../constant/financial-reports.const';
import {
  DailyRevenueReportData,
  DailyRevenueReportResponse,
  MonthlySummaryReportData,
  MonthlySummaryReportResponse,
} from '../types/financial-reports.types';
import { ReportClass, RowStyles } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class MonthlySummary extends RowStyles {
  day: string;
  roomCount: number;
  occupancy: string;
  avgDailyRateIncludeInclusion: number;
  avgDailyRateExcludeInclusion: number;
  roomRent: number;
  roomInclusions: number;
  totalTaxes: number;
  directSales: number;
  directSaleTax: number;
  grossTotal: number;
  deserialize(input: MonthlySummaryReportResponse, isSubTotal?: boolean) {
    this.day = getFormattedDate(input?.date);
    this.roomCount = input.totalRooms;
    this.occupancy = input.occupancyPercentage + '%';
    this.avgDailyRateIncludeInclusion = 0;
    this.avgDailyRateExcludeInclusion = input.averageRate;
    this.roomRent = input.roomRevenue;
    this.roomInclusions = input.inclusionOrAddOn;
    this.totalTaxes = input.totalTax;
    this.directSales = 0;
    this.directSaleTax = 0;
    this.grossTotal = input.grossTotal;
    this.isBold = isSubTotal ? true : undefined;
    this.isGreyBg = isSubTotal ? true : undefined;
    return this;
  }
}
export class MonthlySummaryReport
  implements ReportClass<MonthlySummaryReportData, any> {
  records: MonthlySummaryReportData[];
  deserialize(value: MonthlySummaryReportResponse[]) {
    this.records = new Array<MonthlySummaryReportData>();
    this.records = value.map((item) => {
      return new MonthlySummary().deserialize(item, item.subTotalObject);
    });
    return this;
  }
}

export class DailyRevenueReport
  implements ReportClass<DailyRevenueReportData, any> {
  records: DailyRevenueReportData[];
  deserialize(value: DailyRevenueReportResponse[]) {
    this.records = new Array<DailyRevenueReportData>();
    value = value.map((item) => {
      const totalRoom = item?.roomRevenue ?? 0;
      const totalOthers = (item?.cancellation ?? 0) + (item?.noShow ?? 0) ?? 0;
      const totalRevenue = (totalRoom ?? 0) + (totalOthers ?? 0) ?? 0;
      const totalPayable = (totalRevenue ?? 0) + (item?.totalTax ?? 0) ?? 0;
      return {
        ...item,
        totalRoom: totalRoom,
        totalOthers: totalOthers,
        totalRevenue: totalRevenue,
        totalPayable: totalPayable,
      };
    });
    const grossData = value.find((item) => item.calenderType === 'GROSS') ?? {};
    const adjData = value.find((item) => item.calenderType === 'ADJ') ?? {};
    const dayData = value.find((item) => item.calenderType === 'DAY') ?? {};
    const monthData = value.find((item) => item.calenderType === 'MONTH') ?? {};
    const yearData = value.find((item) => item.calenderType === 'YEAR') ?? {};

    dailyRevenueReportRows.forEach((item) => {
      dailyRevenueReportHeaderRows.includes(item.name)
        ? this.records.push({
            emptyCell: item.label,
            gross: ' ',
            adj: ' ',
            today: ' ',
            month: ' ',
            year: ' ',
            isBold: true,
            isBlueBg: true,
          })
        : this.records.push({
            emptyCell: item.label,
            gross: grossData[item.name],
            adj: adjData[item.name],
            today: dayData[item.name],
            month: monthData[item.name],
            year: yearData[item.name],
            isBold: dailyRevenueReportSubTotalRows.includes(item.name),
            isGreyBg: dailyRevenueReportSubTotalRows.includes(item.name),
            isBlackBg: item.name === 'totalPayable',
          });
    });

    return this;
  }
}

const dailyRevenueReportSubTotalRows = [
  'totalRoom',
  'totalOthers',
  'totalRevenue',
  'totalTax',
];

const dailyRevenueReportHeaderRows = [
  'room',
  'roomOthers',
  'addOns',
  'payable',
];

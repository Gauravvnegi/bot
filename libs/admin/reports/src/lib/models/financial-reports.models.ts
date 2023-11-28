import { dailyRevenueReportRows } from '../constant/financial-reports.const';
import {
  CloseOutBalanceData,
  CloseOutBalanceResponse,
  DailyRevenueReportData,
  DailyRevenueReportResponse,
  DepositReportData,
  DepositReportResponse,
  FinancialReportData,
  FinancialReportResponse,
  MonthlySummaryReportData,
  MonthlySummaryReportResponse,
  PostingAuditReportData,
  PostingAuditReportResponse,
} from '../types/financial-reports.types';
import { ReportClass, RowStyles } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class FinancialReport
  implements ReportClass<FinancialReportData, FinancialReportResponse> {
  records: FinancialReportData[];
  deserialize(value: FinancialReportResponse[]) {
    this.records = new Array<FinancialReportData>();

    this.records =
      value &&
      value.map((element) => {
        return {
          bookingNo: element?.number,
          folioNo: element?.invoiceCode,
          nights: element?.nightCount,
          lodging: element?.reservationItemsPayment?.totalRoomCharge,
          lodgingTax:
            element?.reservationItemsPayment.totalCgstTax +
            element?.reservationItemsPayment?.totalSgstTax, //need to confirm
          discount: element?.paymentSummary?.totalDiscount,
          otherCharges: element?.reservationItemsPayment?.totalAddOnsAmount,
          otherChargesTax: element?.paymentSummary?.totalSgstTax,
          otherChargesDiscount: undefined, //need to confirm
          postTaxTotal:
            element?.reservationItemsPayment.totalCgstTax +
            element?.reservationItemsPayment?.totalSgstTax, //need to confirm
          paid: element?.reservationItemsPayment?.paidAmount,
          balance: element?.reservationItemsPayment?.dueAmount,
        };
      });
    return this;
  }
}

export class CloseOutBalanceReport
  implements ReportClass<CloseOutBalanceData, CloseOutBalanceResponse> {
  records: CloseOutBalanceData[];
  deserialize(value: CloseOutBalanceResponse[]): this {
    this.records = new Array<CloseOutBalanceData>();
    this.records =
      value &&
      value.map((item) => {
        return {
          bookingNo: item?.number,
          folioNo: item?.invoiceCode,
          checkOut: getFormattedDate(item?.departureTime),
          guestName: `${item?.guestDetails.primaryGuest.firstName} ${item?.guestDetails.primaryGuest.lastName}`,
          lodgingAndTax:
            item?.reservationItemsPayment?.totalCgstTax +
            item?.reservationItemsPayment?.totalSgstTax, //need to confirm
          otherChargesAndTax: item?.reservationItemsPayment.totalAddOnsAmount, //need to confirm
          amount: item?.reservationItemsPayment?.paidAmount,
          collected: item?.paymentSummary?.paidAmount,
          openBalance: item?.paymentSummary?.dueAmount,
        };
      });
    return this;
  }
}

export class DepositReport
  implements ReportClass<DepositReportData, DepositReportResponse> {
  records: DepositReportData[];

  deserialize(value: DepositReportResponse[]) {
    this.records = new Array<DepositReportData>();

    this.records =
      value &&
      value.map((item) => {
        return {
          bookingNo: item?.number,
          guestName: `${item?.guestDetails.primaryGuest.firstName} ${item?.guestDetails.primaryGuest.lastName}`,
          checkIn: getFormattedDate(item?.arrivalTime),
          checkOut: getFormattedDate(item?.departureTime),
          nights: item?.nightCount,
          lodging: item?.reservationItemsPayment?.totalRoomCharge,
          otherCharges: item?.reservationItemsPayment?.totalAddOnsAmount,
          taxes:
            item?.reservationItemsPayment?.totalCgstTax +
            item?.reservationItemsPayment?.totalSgstTax,
          btc: undefined,
          cash: undefined,
          bankTransfer: undefined,
          payAtDesk: undefined,
          onlinePaymentGateway: undefined,
          totalPaid: item?.reservationItemsPayment?.paidAmount,
          lastDepositDate: undefined,
        };
      });

    return this;
  }
}

export class PostingAuditReport
  implements ReportClass<PostingAuditReportData, PostingAuditReportResponse> {
  records: PostingAuditReportData[];
  deserialize(value: PostingAuditReportResponse[]): this {
    this.records = new Array<PostingAuditReportData>();

    this.records =
      value &&
      value.map((item) => {
        return {
          room: `${item?.stayDetails?.room.roomNumber} ${item?.stayDetails?.room.type}`,
          name: `${item?.guestDetails?.primaryGuest?.firstName} ${item?.guestDetails?.primaryGuest?.lastName}`,
          user: undefined,
          trxAmount: undefined,
          baseAmount: undefined,
          cgst: undefined,
          sgst: undefined,
        };
      });
    return this;
  }
}

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
      debugger;
      const totalRevenue = totalRoom + totalOthers + item?.inclusionOrAddOn;
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

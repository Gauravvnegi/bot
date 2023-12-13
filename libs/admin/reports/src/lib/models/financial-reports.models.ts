import { I } from '@angular/cdk/keycodes';
import {
  advanceDepositPaymentCols,
  dailyRevenueReportRows,
} from '../constant/financial-reports.const';
import {
  AdvanceDepositPaymentReportData,
  AdvanceDepositPaymentReportResponse,
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
  PaymentMode,
  PostingAuditReportData,
  PostingAuditReportResponse,
  RevParRoomReportData,
  RevParRoomReportResponse,
} from '../types/financial-reports.types';
import { ReportClass, RowStyles } from '../types/reports.types';
import {
  getFormattedDate,
  getFormattedDateWithTime,
} from './reservation-reports.models';
import {
  currencyToNumber,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { get } from 'lodash';

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
          lodging: toCurrency(
            element?.reservationItemsPayment?.totalRoomCharge
          ),

          lodgingTax: toCurrency(
            element?.reservationItemsPayment.totalCgstTax +
              element?.reservationItemsPayment?.totalSgstTax
          ),

          discount: toCurrency(
            element?.reservationItemsPayment?.totalRoomDiscount
          ),

          otherCharges: toCurrency(
            element?.reservationItemsPayment?.totalAddOnsAmount
          ),

          otherChargesTax: toCurrency(
            element?.reservationItemsPayment.totalAddOnsTax
          ),

          otherChargesDiscount: toCurrency(
            element.reservationItemsPayment.totalAddOnsDiscount
          ),

          postTaxTotal: toCurrency(
            element?.reservationItemsPayment?.totalRoomCharge +
              element?.reservationItemsPayment?.totalAddOnsAmount +
              element?.reservationItemsPayment.totalCgstTax +
              element?.reservationItemsPayment?.totalSgstTax +
              element?.reservationItemsPayment.totalAddOnsTax
          ),

          paid: toCurrency(element?.paymentSummary?.paidAmount),

          balance: toCurrency(element?.paymentSummary?.dueAmount),
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
          lodgingAndTax: toCurrency(
            +(
              item?.reservationItemsPayment?.totalCgstTax +
              item?.reservationItemsPayment?.totalSgstTax +
              item?.reservationItemsPayment.totalRoomCharge
            ).toFixed(2)
          ),

          otherChargesAndTax: toCurrency(
            +(
              item?.reservationItemsPayment.totalAddOnsAmount +
              item?.reservationItemsPayment?.totalAddOnsTax
            ).toFixed(2)
          ),

          amount: toCurrency(item?.paymentSummary?.totalAmount),
          collected: toCurrency(item?.paymentSummary?.paidAmount),
          openBalance: toCurrency(item?.paymentSummary?.dueAmount),
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
        const formattedCheckIn = getFormattedDate(item?.arrivalTime);
        const formattedCheckOut = getFormattedDate(item?.departureTime);
        const lastDepositDate =
          item?.paymentModesAndTotalAmount[0]?.lastPaymentDate &&
          getFormattedDate(
            item?.paymentModesAndTotalAmount[0]?.lastPaymentDate
          );

        const onlinePaymentGateway = toCurrency(
          currencyToNumber(getPaymentMethodAmount(item, 'CCAVENUE')) +
            currencyToNumber(getPaymentMethodAmount(item, 'Stripe')) +
            currencyToNumber(getPaymentMethodAmount(item, 'PayU'))
        );

        return {
          bookingNo: item?.number,
          guestName: item?.guestDetails?.primaryGuest
            ? `${item?.guestDetails.primaryGuest.firstName} ${item?.guestDetails.primaryGuest.lastName}`
            : '',
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
          nights: item?.nightCount,
          lodging: toCurrency(item?.reservationItemsPayment?.totalRoomCharge),
          otherCharges: toCurrency(
            item?.reservationItemsPayment?.totalAddOnsAmount
          ),
          taxes: toCurrency(
            (item?.reservationItemsPayment?.totalCgstTax || 0) +
              (item?.reservationItemsPayment?.totalSgstTax || 0)
          ),
          btc: getPaymentMethodAmount(item, 'Bill to Company'),
          cash: getPaymentMethodAmount(item, 'Cash Payment'),
          bankTransfer: toCurrency(
            currencyToNumber(getPaymentMethodAmount(item, 'Bank Transfer')) +
              currencyToNumber(getPaymentMethodAmount(item, 'Bank Deposit'))
          ),

          payAtDesk: getPaymentMethodAmount(item, 'Pay at Desk'),
          onlinePaymentGateway: onlinePaymentGateway,

          totalPaid: toCurrency(item?.reservationItemsPayment?.paidAmount),

          lastDepositDate: lastDepositDate,
        };
      });

    return this;
  }
}

export function getPaymentMethodAmount(
  item: any,
  paymentMode: PaymentMode
): string {
  return toCurrency(
    item?.paymentModesAndTotalAmount?.find(
      (payment) => payment.paymentMode === paymentMode
    )?.totalAmount || 0
  );
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
          user:
            item?.user?.firstName &&
            `${item?.user.firstName} ${item?.user?.lastName}`,
          trxAmount: toCurrency(item?.paymentSummary?.totalAmount),
          baseAmount: toCurrency(
            item?.reservationItemsPayment?.totalRoomCharge
          ),
          cgst: toCurrency(item?.reservationItemsPayment?.totalCgstTax),
          sgst: toCurrency(item?.reservationItemsPayment?.totalSgstTax),
        };
      });
    return this;
  }
}

export class MonthlySummary extends RowStyles {
  day: string;
  roomCount: number;
  occupancy: string;
  avgDailyRateIncludeInclusion: string;
  avgDailyRateExcludeInclusion: string;
  roomRent: string;
  roomInclusions: string;
  totalTaxes: string;
  directSales: string;
  directSaleTax: string;
  grossTotal: string;
  deserialize(input: MonthlySummaryReportResponse, isSubTotal?: boolean) {
    this.day = isSubTotal ? ' ' : getFormattedDate(input?.date);
    this.roomCount = input.totalRooms;
    this.occupancy = input.occupancyPercentage + '%';
    this.avgDailyRateIncludeInclusion = toCurrency(input?.averageRateIncl);
    this.avgDailyRateExcludeInclusion = toCurrency(input.averageRate);
    this.roomRent = toCurrency(input.roomRevenue);
    this.roomInclusions = toCurrency(input.inclusionOrAddOn);
    this.totalTaxes = toCurrency(input.totalTax);
    this.directSales = toCurrency(0);
    this.directSaleTax = toCurrency(0);
    this.grossTotal = toCurrency(input.grossTotal);
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
    // const grossData = value.find((item) => item.calenderType === 'GROSS') ?? {};
    // const adjData = value.find((item) => item.calenderType === 'ADJ') ?? {};
    const dayData = value.find((item) => item.calenderType === 'DAY') ?? {};
    const monthData = value.find((item) => item.calenderType === 'MONTH') ?? {};
    const yearData = value.find((item) => item.calenderType === 'YEAR') ?? {};

    dailyRevenueReportRows.forEach((item) => {
      dailyRevenueReportHeaderRows.includes(item.name)
        ? this.records.push({
            emptyCell: item.label,
            // gross: ' ',
            // adj: ' ',
            today: ' ',
            month: ' ',
            year: ' ',
            isBold: true,
            isBlueBg: true,
          })
        : this.records.push({
            emptyCell: item.label,
            // gross: grossData[item.name],
            // adj: adjData[item.name],
            today: toCurrency(dayData[item.name]),
            month: toCurrency(monthData[item.name]),
            year: toCurrency(yearData[item.name]),
            isBold: dailyRevenueReportSubTotalRows.includes(item.name),
            isGreyBg: dailyRevenueReportSubTotalRows.includes(item.name),
            isBlackBg: item.name === 'totalPayable',
          });
    });

    return this;
  }
}

//advanceDepositPayment
export class AdvanceDepositPaymentReport
  implements
    ReportClass<
      AdvanceDepositPaymentReportData,
      AdvanceDepositPaymentReportResponse
    > {
  records: AdvanceDepositPaymentReportData[];

  deserialize(value: AdvanceDepositPaymentReportResponse[]): this {
    this.records = new Array<AdvanceDepositPaymentReportData>();

    this.records =
      value &&
      value.map((item) => {
        return {
          bookingNo: item?.reservationNumber,
          // groupId: undefined,
          checkIn: getFormattedDate(item?.reservation?.arrivalTime),
          checkOut: getFormattedDate(item?.reservation?.departureTime),
          advancedDepositDate: getFormattedDateWithTime(item?.created),
          paymentMode: item?.paymentMethod,
          advancedDepositAmount: toCurrency(item?.amount),
        };
      });
    return this;
  }
}

//revParRoomReport
export class RevParRoomReport
  implements ReportClass<RevParRoomReportData, RevParRoomReportResponse> {
  records: RevParRoomReportData[];

  deserialize(value: RevParRoomReportResponse[]): this {
    this.records = new Array<RevParRoomReportData>();

    this.records =
      value &&
      value?.map((item) => {
        return {
          totalRoomInventory: item?.totalRooms,
          revParIncludeInclusion: item?.revPar + item?.inclusionOrAddOn,

          revParExcludeInclusion: item?.revPar,

          totalRoomRent: toCurrency(item?.roomRevenue),

          totalRoomInclusions: toCurrency(item?.inclusionOrAddOn),

          totalTaxes: toCurrency(item?.totalTax),
          // totalOtherCharges: toCurrency(item?.inclusionOrAddOn),
          // totalOtherTaxes: undefined,
          grossTotal: toCurrency(item?.grossTotal + item?.inclusionOrAddOn),
        };
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

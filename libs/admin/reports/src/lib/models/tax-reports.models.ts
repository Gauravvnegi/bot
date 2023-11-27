import { monthlyTaxReportRows } from '../constant/tax-reports.const';
import { ReportClass } from '../types/reports.types';
import {
  LodgingTaxReportData,
  LodgingTaxReportResponse,
  MonthlyTaxReportData,
  MonthlyTaxReportResponse,
  TaxReportData,
  TaxReportResponse,
} from '../types/tax-reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class MonthlyTaxReport
  implements ReportClass<MonthlyTaxReportData, MonthlyTaxReportResponse> {
  records: MonthlyTaxReportData[];

  deserialize(value: MonthlyTaxReportResponse[]) {
    this.records = new Array<MonthlyTaxReportData>();
    value &&
      value.forEach((reservationData) => {
        this.records.push({
          taxName: reservationData.type,
          taxCategory: reservationData.category,
          amount: reservationData.amount,
        });
      });
    return this;
  }
}

export class LodgingTaxReport
  implements ReportClass<LodgingTaxReportData, any> {
  records: LodgingTaxReportData[];

  deserialize(value: LodgingTaxReportResponse[]) {
    this.records = new Array<LodgingTaxReportData>();
    value &&
      value.forEach((reservationData) => {
        this.records.push(
          new LodgingTaxReportDataModel().deserialize(reservationData)
        );
      });
    return this;
  }
}

export class LodgingTaxReportDataModel {
  res: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  rate: number;
  discounts: number;
  netRate: number;
  occupancyTax: number;
  otherTax: number;

  deserialize(input: LodgingTaxReportResponse) {
    this.res = input?.number;
    this.guestName =
      input.guestDetails.primaryGuest.firstName +
      ' ' +
      input.guestDetails.primaryGuest.lastName;
    this.checkInDate = input.stayDetails.arrivalTime
      ? getFormattedDate(input.stayDetails.arrivalTime)
      : '';
    this.checkOutDate = input.stayDetails.departureTime
      ? getFormattedDate(input.stayDetails.departureTime)
      : '';
    this.roomType = input.stayDetails.room.type;
    this.rate = input.paymentSummary.totalAmount;
    this.discounts = input.paymentSummary.totalDiscount;
    this.netRate = input.paymentSummary.totalAmount;
    this.occupancyTax =
      input.paymentSummary.totalCgstTax + input.paymentSummary.totalSgstTax;
    this.otherTax = input.paymentSummary.totalAddOnsAmount;
    return this;
  }
}

export class TaxReport implements ReportClass<TaxReportData, any> {
  records: TaxReportData[];

  deserialize(value: TaxReportResponse[]) {
    this.records = new Array<TaxReportData>();
    value &&
      value.forEach((reservationData) => {
        this.records.push(
          new TaxReportDataModel().deserialize(reservationData)
        );
      });

    return this;
  }
}

export class TaxReportDataModel {
  res: string;
  checkInDate: string;
  checkOutDate: string;
  roomCharge: number;
  otherCharge: number;
  cgst: number;
  sgst: number;
  postTaxTotal: number;

  deserialize(value: TaxReportResponse) {
    this.res = value.number;
    this.checkInDate = value.stayDetails.arrivalTime
      ? getFormattedDate(value.stayDetails.arrivalTime)
      : '';

    this.checkOutDate = value.stayDetails.departureTime
      ? getFormattedDate(value.stayDetails.departureTime)
      : '';
    this.roomCharge = value.paymentSummary.totalAmount;
    this.otherCharge = value?.reservationItemsPayment?.totalAddOnsAmount;
    this.cgst = value.reservationItemsPayment?.totalCgstTax;
    this.sgst = value.reservationItemsPayment.totalSgstTax;
    this.postTaxTotal =
      value.reservationItemsPayment?.totalCgstTax +
      value.reservationItemsPayment?.totalSgstTax;

    return this;
  }
}

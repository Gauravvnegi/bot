import { toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';
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
          amount: toCurrency(reservationData.amount) as any,
        });
      });

    this.records.push({
      taxName: 'Total Tax',
      taxCategory: ' ',
      amount: toCurrency(
        this.records.reduce((acc, item) => {
          acc += item.amount;
          return acc;
        }, 0)
      ),
      isSubTotal: true,
    } as any);

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
  id: string;
  res: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  rate: string;
  discounts: string;
  netRate: string;
  occupancyTax: string;
  otherTax: string;

  deserialize(input: LodgingTaxReportResponse) {
    this.id = input?.id;
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
    this.rate = toCurrency(
      input.reservationItemsPayment.totalRoomCharge +
        input.reservationItemsPayment.totalRoomDiscount
    );

    this.discounts = toCurrency(
      input.reservationItemsPayment.totalRoomDiscount
    );

    this.netRate = toCurrency(input.reservationItemsPayment.totalRoomCharge);
    this.occupancyTax = toCurrency(
      input.reservationItemsPayment.totalCgstTax +
        input.reservationItemsPayment.totalSgstTax
    );

    this.otherTax = toCurrency(input.reservationItemsPayment.totalAddOnsTax);
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
  id: string;
  res: string;
  checkInDate: string;
  checkOutDate: string;
  roomCharge: string;
  otherCharge: string;
  cgst: string;
  sgst: string;
  postTaxTotal: string;

  deserialize(value: TaxReportResponse) {
    this.id = value?.id;
    this.res = value.number;
    this.checkInDate = value.stayDetails.arrivalTime
      ? getFormattedDate(value.stayDetails.arrivalTime)
      : '';

    this.checkOutDate = value.stayDetails.departureTime
      ? getFormattedDate(value.stayDetails.departureTime)
      : '';
    this.roomCharge = toCurrency(
      value.reservationItemsPayment?.totalRoomCharge
    );
    this.otherCharge = toCurrency(
      value?.reservationItemsPayment?.totalAddOnsAmount
    );
    this.cgst = toCurrency(value.reservationItemsPayment?.totalCgstTax);
    this.sgst = toCurrency(value.reservationItemsPayment.totalSgstTax);

    this.postTaxTotal = toCurrency(
      value.reservationItemsPayment?.totalCgstTax +
        value.reservationItemsPayment?.totalSgstTax +
        value?.reservationItemsPayment?.totalRoomCharge +
        value?.reservationItemsPayment?.totalAddOnsAmount
    );

    return this;
  }
}

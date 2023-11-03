import {
  GuestHistoryData,
  GuestHistoryResponse,
  SalesByGuestData,
  SalesByGuestResponse,
} from '../types/guest-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class GuestHistory implements ReportClass<GuestHistoryData, any> {
  records: GuestHistoryData[];

  deserialize(value: GuestHistoryResponse[]) {
    this.records = new Array<GuestHistoryData>();

    value.forEach((reservationData) => {
      this.records.push(new GuestHistoryModel().deserialize(reservationData));
    });
    return this;
  }
}

export class GuestHistoryModel {
  guestName: string;
  firstStayed: string;
  lastStayed: string;
  noOfResv: number;
  roomCharges: number;
  roomTax: number;
  otherCharges: number;
  totalCharges: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  deserialize(input: GuestHistoryResponse) {
    this.guestName = `${input?.firstName ?? ''} ${
      input?.lastName ?? ''
    }`.trim();
    if (input.firstStay) this.firstStayed = getFormattedDate(input.firstStay);
    if (input.lastStay) this.lastStayed = getFormattedDate(input.lastStay);
    this.noOfResv = input.reservation.length;

    return this;
  }
}

export class SalesByGuest implements ReportClass<SalesByGuestData, any> {
  records: SalesByGuestData[];

  deserialize(value: SalesByGuestResponse[]) {
    this.records = new Array<SalesByGuestData>();

    value.forEach((reservationData) => {
      this.records.push(new SalesByGuestModel().deserialize(reservationData));
    });
    return this;
  }
}

export class SalesByGuestModel {
  guestId: string;
  firstName: string;
  LastName: string;
  country: string;
  emailId: string;
  firstStayed: string;
  lastStayed: string;
  noOfRes: number;
  nights: number;
  totalSales: number;
  deserialize(input: SalesByGuestResponse) {
    this.guestId = input.id;
    this.firstName = input.firstName;
    this.LastName = input.lastName;
    this.country = input.address.countryCode;
    this.emailId = input.contactDetails.emailId;
    if (input.firstStay) this.firstStayed = getFormattedDate(input.firstStay);
    if (input.lastStay) this.lastStayed = getFormattedDate(input.lastStay);
    this.noOfRes = input.reservation.length;
    this.nights = input.totalNights;
    this.totalSales = input.totalSales;
    return this;
  }
}

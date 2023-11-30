import {
  GuestContactReportData,
  GuestContactReportResponse,
  GuestHistoryData,
  GuestHistoryResponse,
  GuestLedgerData,
  GuestLedgerResponse,
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

export class GuestContactReport
  implements ReportClass<GuestContactReportData, GuestContactReportResponse> {
  records: GuestContactReportData[];
  deserialize(value: GuestContactReportResponse[]): this {
    this.records = new Array<GuestContactReportData>();
    this.records =
      value &&
      value.map((item) => {
        return {
          guestId: item?.id,
          salutation: item?.salutation,
          name: `${item?.firstName} ${item?.lastName}`,
          address: item?.address?.addressLine1, //need to confirm
          city: item?.address?.city,
          state: item?.address?.state,
          country: item?.address?.country,
          email: item?.contactDetails?.emailId,
          dateOfBirth: item?.dateOfBirth && getFormattedDate(item?.dateOfBirth), //need to confirm
          mobileNo: `${item?.contactDetails?.cc} ${item?.contactDetails?.contactNumber}`,
          phone: undefined, //need to confirm
          fax: undefined, //need to confirm
          gender: item?.gender, //need to confirm
          idType: undefined, //need to confirm
          nationality: item.nationality, //need to confirm
          zipCode: item?.address?.postalCode, //need to confirm
        };
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
    const reservationData = input.reservation[input.reservation.length - 1];

    this.roomCharges = reservationData.reservationItemsPayment.totalRoomCharge;
    this.roomTax =
      reservationData.reservationItemsPayment.totalCgstTax +
      reservationData.reservationItemsPayment.totalSgstTax;
    
    this.otherCharges = reservationData.reservationItemsPayment.totalAddOnsAmount;

    this.totalCharges =
      reservationData.reservationItemsPayment.totalAddOnsAmount +
      reservationData.reservationItemsPayment.totalRoomCharge;
    
    this.totalAmount = reservationData.paymentSummary.totalAmount;
    this.balance = reservationData.paymentSummary.dueAmount;

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

export class GuestLedger implements ReportClass<GuestLedgerData, any> {
  records: GuestLedgerData[];

  deserialize(value: GuestLedgerResponse[]) {
    this.records = new Array<GuestLedgerData>();
    value &&
      value.forEach((reservationData) => {
        this.records.push({
          roomNo: reservationData?.stayDetails?.room?.roomNumber,
          name: `${
            reservationData?.guestDetails.primaryGuest.firstName ?? ''
          } ${
            reservationData?.guestDetails?.primaryGuest.lastName ?? ''
          }`.trim(),
          confirmationNo: reservationData?.number,
          balance: reservationData?.paymentSummary?.totalAmount,
        });
      });
    return this;
  }
}

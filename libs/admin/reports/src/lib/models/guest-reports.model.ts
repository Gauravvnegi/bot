import {
  convertToNormalCase,
  getFullName,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  GuestComplaintReportData,
  GuestComplaintReportResponse,
  GuestContactReportData,
  GuestContactReportResponse,
  GuestEscalationComplaintReportData,
  GuestEscalationComplaintReportResponse,
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
          name: getFullName(item?.firstName, item?.lastName),
          address: item?.address?.addressLine1,
          city: item?.address?.city,
          state: item?.address?.state,
          country: item?.address?.country,
          email: item?.contactDetails?.emailId,
          dateOfBirth: item?.dateOfBirth && getFormattedDate(item?.dateOfBirth),
          mobileNo: `${item?.contactDetails?.cc} ${item?.contactDetails?.contactNumber}`,
          phone: undefined, //need to confirm
          fax: undefined, //need to confirm
          gender: item?.gender, //need to confirm
          idType: undefined, //need to confirm
          nationality: item.nationality,
          zipCode: item?.address?.postalCode,
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
  roomCharges: string;
  roomTax: string;
  otherCharges: string;
  totalCharges: string;
  totalAmount: string;
  amountPaid: string;
  balance: string;
  deserialize(input: GuestHistoryResponse) {
    this.guestName = getFullName(input?.firstName, input?.lastName);
    if (input.firstStay) this.firstStayed = getFormattedDate(input.firstStay);
    if (input.lastStay) this.lastStayed = getFormattedDate(input.lastStay);
    this.noOfResv = input.reservation.length;

    const reservationData = input.reservation[0];

    this.roomCharges = toCurrency(
      reservationData.reservationItemsPayment.totalRoomCharge
    );
    this.roomTax = toCurrency(
      reservationData.reservationItemsPayment.totalCgstTax +
        reservationData.reservationItemsPayment.totalSgstTax
    );

    this.otherCharges = toCurrency(
      reservationData.reservationItemsPayment.totalAddOnsAmount
    );

    this.totalCharges = toCurrency(
      reservationData.reservationItemsPayment.totalAddOnsAmount +
        reservationData.reservationItemsPayment.totalRoomCharge
    );

    this.totalAmount = toCurrency(reservationData.paymentSummary.totalAmount);
    this.balance = toCurrency(reservationData.paymentSummary.dueAmount);

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
          id: reservationData?.id,
          roomNo: reservationData?.stayDetails?.room?.roomNumber,
          name: getFullName(
            reservationData?.guestDetails.primaryGuest.firstName,
            reservationData?.guestDetails?.primaryGuest.lastName
          ),
          confirmationNo: reservationData?.number,
          balance: toCurrency(reservationData?.paymentSummary?.dueAmount),
        });
      });
    return this;
  }
}

export class GuestEscalationComplaintReport
  implements
    ReportClass<
      GuestEscalationComplaintReportData,
      GuestEscalationComplaintReportResponse
    > {
  records: GuestEscalationComplaintReportData[];
  deserialize(value: GuestEscalationComplaintReportResponse[]): this {
    this.records = new Array<GuestEscalationComplaintReportData>();

    this.records =
      value &&
      value.map((item) => {
        return {
          guestName: item?.guestName,
          serviceItem: item?.itemName,
          complaint: item?.description.length ? item?.description : undefined,
          status: item?.status,
          actionTakenBy: item?.assignedTo,
          department: undefined,
          customerSentiment: undefined,
          sla: item?.sla,
          jobDuration: item?.jobDuration,
          escalationLevel: item?.level,
          frequency: undefined,
        };
      });
    return this;
  }
}

export class GuestComplaintReport
  implements
    ReportClass<GuestComplaintReportData, GuestComplaintReportResponse> {
  records: GuestComplaintReportData[];
  deserialize(value: GuestComplaintReportResponse[]): this {
    this.records = new Array<GuestComplaintReportData>();

    this.records =
      value &&
      value.map((item) => {
        return {
          guestId: item?.guestDetails?.primaryGuest?.id,
          guestName: getFullName(
            item?.guestDetails?.primaryGuest?.firstName,
            item?.guestDetails?.primaryGuest?.lastName
          ),
          serviceItem: item?.itemName,
          complaint: item?.remarks.length ? item?.remarks : undefined,
          status: item?.status,
          actionTakenBy: item?.assigneeName,
          department: convertToNormalCase(item?.departmentName),
          customerSentiment: undefined,
          sla: item?.sla,
          jobDuration: item?.jobDuration,
        };
      });
    return this;
  }
}

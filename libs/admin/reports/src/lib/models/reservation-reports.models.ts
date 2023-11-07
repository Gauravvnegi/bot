import {
  DraftReservationReportResponse,
  ReservationResponse,
  ReservationResponseData,
} from 'libs/admin/shared/src/lib/types/response';
import { ReportClass } from '../types/reports.types';
import {
  ArrivalReportData,
  CancellationReportData,
  DepartureReportData,
  DraftReservationReportData,
  EmployeeWiseReservationReportData,
  HousekeepingReportData,
  HousekeepingReportResponse,
  IncomeSummaryReportData,
  MarketSegmentReportData,
  MarketSegmentReportResponse,
  NoShowReportData,
  ReservationAdrReportData,
  ReservationReportData,
  ReservationSummaryReportData,
} from '../types/reservation-reports.types';
import {
  marketSegmentReportCols,
  marketSegmentReportRows,
} from '../constant/reservation-reports.const';
import { label } from 'libs/admin/guest-dashboard/src/lib/constants/guest';

/**
 * @class Default Reservation Report class
 * Will be extended in every reservation report
 */
class ReservationReport {
  defaultValue: ReservationReportData;
  getDefaultValues(reservationData: ReservationResponseData) {
    this.defaultValue = {
      id: reservationData.id,
      amountPaid: reservationData.totalPaidAmount,
      balance: reservationData.totalDueAmount,
      bookingAmount: reservationData.paymentSummary?.totalAmount,
      bookingNo: reservationData.number,
      guestName:
        reservationData?.guestDetails?.primaryGuest.firstName +
        ' ' +
        reservationData?.guestDetails?.primaryGuest.lastName,
      otherCharges: null,
    };

    return this.defaultValue;
  }
}

export class NoShows {
  id?: string;
  bookingNumber: string;
  dateOfArrival: string;
  noShowOn: string;
  guestName: string;
  bookingAmount: string;
  noShowCharge: string;
  noShowReason: string;
  otherCharge: string;
  amountPaid: string;
  balance: string;
  deserialize(value: ReservationResponse) {
    this.id = value?.id;
    this.bookingNumber = value?.reservationNumber;
    this.dateOfArrival = getFormattedDate(value?.from);
    this.noShowOn = getFormattedDate(value?.from);
    this.guestName = `${value?.guest.firstName ?? ''} ${
      value?.guest?.lastName ?? ''
    }`.trim();
    this.bookingAmount = `${value?.pricingDetails?.totalAmount}`;
    this.noShowCharge = null;
    this.noShowReason = null;
    this.otherCharge = null;
    this.amountPaid = `${value?.pricingDetails?.totalPaidAmount}`;
    this.balance = `${value?.pricingDetails?.totalDueAmount}`;
    return this;
  }
}

export class NoShowReport extends ReservationReport
  implements ReportClass<NoShowReportData, ReservationResponse> {
  records: NoShowReportData[];

  deserialize(value: ReservationResponse[]) {
    this.records = new Array<NoShowReportData>();
    value.forEach((reservationData) => {
      this.records.push(new NoShows().deserialize(reservationData));
    });
    return this;
  }
}

export class Cancellation extends NoShows {
  roomType: string;
  checkIn: string;
  checkOut: string;
  night: string;
  cancelledOn: string;
  cancellationCharge: string;
  cancellationReason: string;

  deserialize(value: ReservationResponse): this {
    super.deserialize(value);
    const roomDetails = value.bookingItems[0];
    this.roomType = `${roomDetails?.roomDetails?.roomNumber}/${roomDetails?.roomDetails?.roomTypeLabel}`;
    this.checkIn = getFormattedDate(value?.from);
    this.checkOut = getFormattedDate(value?.to);
    this.night = `${calculateNumberOfNights(value.from, value.to)}`;
    this.cancelledOn = getFormattedDate(value?.from);
    this.cancellationCharge = null;
    this.cancellationReason = null;
    return this;
  }
}

export class CancellationReport extends ReservationReport
  implements ReportClass<CancellationReportData, ReservationResponse> {
  records: CancellationReportData[];
  deserialize(value: ReservationResponse[]) {
    this.records = new Array<CancellationReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Cancellation().deserialize(reservationData));
    });
    return this;
  }
}

export class Arrival {
  id?: string;
  bookingNo: string;
  guestName: string;
  bookingAmount: number;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  arrivalTime: string;
  remark: string;
  deserialize(input: ReservationResponseData) {
    this.id = input.id;
    (this.bookingAmount = input.paymentSummary.totalAmount),
      (this.bookingNo = input.number),
      (this.guestName =
        input.guestDetails.primaryGuest.firstName +
        ' ' +
        input.guestDetails.primaryGuest.lastName);

    this.roomType = `${input.stayDetails.room.roomNumber}/${input.stayDetails.room.type}`; // need to ask which key should be mapped
    this.checkIn = input?.arrivalTime
      ? getFormattedDate(input.arrivalTime)
      : '';
    this.checkOut = input?.departureTime
      ? getFormattedDate(input.departureTime)
      : '';
    this.status = input?.pmsStatus ?? '';
    this.arrivalTime = input?.arrivalTime
      ? getFormattedDate(input.arrivalTime)
      : '';
    this.remark = input?.specialRequest ?? ''; // need to verify from backend
    return this;
  }
}

export class ArrivalReport extends ReservationReport
  implements ReportClass<ArrivalReportData, ReservationResponseData> {
  records: ArrivalReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ArrivalReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Arrival().deserialize(reservationData));
    });
    return this;
  }
}

export class Departure extends Arrival {
  deserialize(input: ReservationResponseData) {
    super.deserialize(input);
    return this;
  }
}

export class DepartureReport extends ReservationReport
  implements ReportClass<DepartureReportData, ReservationResponseData> {
  records: DepartureReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<DepartureReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Departure().deserialize(reservationData));
    });
    return this;
  }
}

export class DraftReservationReport extends ReservationReport
  implements
    ReportClass<DraftReservationReportData, DraftReservationReportResponse> {
  records: DraftReservationReportData[];
  deserialize(value: DraftReservationReportResponse[]) {
    this.records = new Array<DraftReservationReportData>();
    if (!value) return this;
    value.forEach((reservationData) => {
      this.records.push({
        id: reservationData.id,
        bookingNo: reservationData.reservationNumber,
        guestName: `${reservationData.guest.firstName} ${reservationData.guest.lastName}`,
        roomType: `${
          reservationData.bookingItems[0].roomDetails.roomNumber ?? '-'
        }-${reservationData.bookingItems[0].roomDetails.roomTypeLabel}`,
        checkIn: getFormattedDate(reservationData.from),
        checkOut: getFormattedDate(reservationData.to),
        nights: reservationData.guest.totalNights,
        tempReservedNumber: reservationData.reservationNumber,
        bookingAmount: reservationData.pricingDetails.totalAmount,
        paidAmount: reservationData.pricingDetails.totalPaidAmount,
        balance: reservationData.pricingDetails.totalDueAmount,
        status: reservationData.status,
      });
    });
    return this;
  }
}
//todo
export class EmployeeWiseReservationReport
  implements
    ReportClass<EmployeeWiseReservationReportData, ReservationResponseData> {
  records: EmployeeWiseReservationReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<EmployeeWiseReservationReportData>();
    if (!value) return this;
    value.forEach((reservationData) => {
      const totalCharge =
        reservationData.reservationItemsPayment.totalRoomCharge +
        reservationData.reservationItemsPayment.totalAddOnsAmount;
      this.records.push({
        id: reservationData.id,
        userName: undefined, //to be added in response
        bookingNo: reservationData.number,
        guestName: `${reservationData.guestDetails.primaryGuest.firstName} ${reservationData.guestDetails.primaryGuest.lastName}`,
        checkIn: getFormattedDate(reservationData.stayDetails.arrivalTime),
        checkOut: getFormattedDate(reservationData.stayDetails.departureTime),
        nights: reservationData.guestDetails.primaryGuest.totalNights,
        roomCharge: reservationData.reservationItemsPayment.totalRoomCharge,
        tax:
          reservationData.reservationItemsPayment.totalCgstTax +
          reservationData.reservationItemsPayment.totalSgstTax,
        otherCharges: reservationData.reservationItemsPayment.totalAddOnsAmount,
        totalCharge: totalCharge,
        amountPaid: reservationData.reservationItemsPayment.paidAmount,
      });
    });
    return this;
  }
}

export class ReservationAdrReport
  implements ReportClass<ReservationAdrReportData, ReservationResponseData> {
  records: ReservationAdrReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ReservationAdrReportData>();
    if (!value) return this;

    value.forEach((data) => {
      this.records.push({
        id: data.id,
        bookingNo: data.number,
        guestName: `${data.guestDetails.primaryGuest.firstName} ${data.guestDetails.primaryGuest.lastName}`,
        roomType: data.stayDetails.room.type,
        roomNo: data.stayDetails.room.roomNumber,
        checkIn: getFormattedDate(data.stayDetails.arrivalTime),
        checkOut: getFormattedDate(data.stayDetails.departureTime),
        nights: data.guestDetails.primaryGuest.totalNights,
        roomRent: data.paymentSummary.totalAmount,

        adr: data.guestDetails.primaryGuest.totalNights
          ? data.reservationItemsPayment.totalRoomCharge /
            data.guestDetails.primaryGuest.totalNights
          : data.reservationItemsPayment.totalRoomCharge,
      });
    });

    return this;
  }
}

export class IncomeSummaryReport
  implements ReportClass<IncomeSummaryReportData, ReservationResponseData> {
  records: IncomeSummaryReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<IncomeSummaryReportData>();
    if (!value) return this;

    value.forEach((data) => {
      this.records.push({
        id: data.id,
        bookingNo: data.number,
        guestName: `${data.guestDetails.primaryGuest.firstName} ${data.guestDetails.primaryGuest.lastName}`,
        checkIn: getFormattedDate(data.stayDetails.arrivalTime),
        checkOut: getFormattedDate(data.stayDetails.departureTime),
        nights: data.nightCount,
        lodgingAndOtherCharges:
          data.reservationItemsPayment.totalAddOnsAmount +
          data.reservationItemsPayment.totalRoomCharge,
        taxTotal:
          data.reservationItemsPayment.totalCgstTax +
          data.reservationItemsPayment.totalSgstTax,
        paidAmount: data.paymentSummary.paidAmount,
      });
    });
    return this;
  }
}

//reservationSummaryReport
export class ReservationSummaryReport
  implements
    ReportClass<ReservationSummaryReportData, ReservationResponseData> {
  records: ReservationSummaryReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ReservationSummaryReportData>();
    if (!value) return this;

    value.forEach((data) => {});
    return this;
  }
}

//marketSegmentReport
export class MarketSegmentReport
  implements ReportClass<MarketSegmentReportData, MarketSegmentReportResponse> {
  records: MarketSegmentReportData[];
  deserialize(value: MarketSegmentReportResponse) {
    this.records = new Array<MarketSegmentReportData>();
    if (!value) return this;

    marketSegmentReportRows.forEach((row) => {
      if (value.hasOwnProperty(row.label)) {
        this.records.push({
          marketSegment: row.name,
          nights: value[row.label].nights,
          occupancy: value[row.label].occupancyPercent,
          pax: value[row.label].pax,
          roomRevenue: value[row.label].roomRevenue,
          revenue: value[row.label].revenue,
          arrOrAgr: value[row.label].arr,
          arp: value[row.label].arp,
        });
      } else {
        this.records.push({
          marketSegment: row.name,
          nights: undefined,
          occupancy: undefined,
          pax: undefined,
          roomRevenue: undefined,
          revenue: undefined,
          arrOrAgr: undefined,
          arp: undefined,
        });
      }
    });

    return this;
  }
}

//housekeepingReport
export class HousekeepingReport
  implements ReportClass<HousekeepingReportData, HousekeepingReportResponse> {
  records: HousekeepingReportData[];
  deserialize(value: HousekeepingReportResponse[]) {
    this.records = new Array<HousekeepingReportData>();
    if (!value) return this;

    value.forEach((data) => {
      this.records.push({
        roomNo: data.roomNumber,
        roomType: data.roomTypeName,
        bookingNo: data.reservationNumber,
        guestName: undefined, //to be added in response
        checkIn: undefined, //to be added in response
        checkOut: undefined, //to be added in response
        nights: data.nights,
        roomNotes: data.remarks, //to be added in response
        status: data.status,
      });
    });
    return this;
  }
}

export function getFormattedDate(time: number) {
  const currentDate = new Date(time);
  const monthAbbreviated = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(currentDate);
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();
  return `${monthAbbreviated} ${date}, ${year}`;
}

function calculateNumberOfNights(
  checkinTimestamp: number,
  checkoutTimestamp: number
) {
  const checkinDate = new Date(checkinTimestamp);
  const checkoutDate = new Date(checkoutTimestamp);
  const differenceInMilliseconds =
    checkoutDate.getTime() - checkinDate.getTime();
  const differenceInDays = differenceInMilliseconds / 86400000;
  const numberOfNights = Math.ceil(differenceInDays);
  return numberOfNights;
}

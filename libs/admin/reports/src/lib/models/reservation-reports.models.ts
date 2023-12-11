import {
  DraftReservationReportResponse,
  ReservationResponse,
  ReservationResponseData,
} from 'libs/admin/shared/src/lib/types/response';
import { ReportClass } from '../types/reports.types';
import {
  AddOnRequestReportData,
  AddOnRequestReportResponse,
  ArrivalReportData,
  CancellationReportData,
  DepartureReportData,
  DraftReservationReportData,
  EmployeeWiseReservationReportData,
  EmployeeWiseReservationReportResponse,
  ExpressCheckInData,
  ExpressCheckInResponse,
  HousekeepingReportData,
  HousekeepingReportResponse,
  IncomeSummaryReportData,
  NoShowReportData,
  ReservationAdrReportData,
  ReservationReportData,
  ReservationSummaryReportData,
} from '../types/reservation-reports.types';
import { toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';

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
  departureTime: string;
  remark: string;
  deserialize(input: ReservationResponseData) {
    this.id = input.id;
    (this.bookingAmount = input.paymentSummary.totalAmount),
      (this.bookingNo = input.number),
      (this.guestName =
        input.guestDetails.primaryGuest.firstName +
        ' ' +
        input.guestDetails.primaryGuest.lastName);

    this.roomType = `${input?.stayDetails?.room?.roomNumber ?? '-'} - ${
      input.stayDetails.room.type ?? '-'
    }`; // need to ask which key should be mapped
    this.checkIn = input?.arrivalTime
      ? getFormattedDate(input.arrivalTime)
      : '';
    this.checkOut = input?.departureTime
      ? getFormattedDate(input.departureTime)
      : '';
    this.status = input?.pmsStatus ?? '';
    this.arrivalTime = input?.arrivalTime
      ? getFormattedDateWithTime(input.arrivalTime)
      : '';
    this.departureTime = input?.departureTime
      ? getFormattedDateWithTime(input.departureTime)
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
    value &&
      value.forEach((reservationData) => {
        this.records.push(new Arrival().deserialize(reservationData));
      });
    return this;
  }
}

export class Departure extends Arrival {
  deserialize(input: ReservationResponseData) {
    input && super.deserialize(input);
    return this;
  }
}

export class DepartureReport extends ReservationReport
  implements ReportClass<DepartureReportData, ReservationResponseData> {
  records: DepartureReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<DepartureReportData>();
    value &&
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
    value &&
      value.forEach((reservationData) => {
        this.records.push({
          id: reservationData.id,
          bookingNo: reservationData.reservationNumber,
          guestName: `${reservationData?.guest?.firstName ?? '-'} ${
            reservationData.guest.lastName ?? '-'
          }`,
          roomType: `${
            reservationData.bookingItems[0].roomDetails.roomNumber ?? '-'
          }-${
            reservationData.bookingItems[0].roomDetails.roomTypeLabel ?? '-'
          }`,
          checkIn: getFormattedDate(reservationData.from),
          checkOut: getFormattedDate(reservationData.to),
          nights: reservationData.nightsCount,
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
    ReportClass<
      EmployeeWiseReservationReportData,
      EmployeeWiseReservationReportResponse
    > {
  records: EmployeeWiseReservationReportData[];
  deserialize(value: EmployeeWiseReservationReportResponse[]) {
    this.records = new Array<EmployeeWiseReservationReportData>();
    value &&
      value.forEach((reservationData) => {
        const totalCharge =
          reservationData.reservationItemsPayment.totalRoomCharge +
          reservationData.reservationItemsPayment.totalAddOnsAmount;
        this.records.push({
          id: reservationData.id,
          userName:
            reservationData?.user?.firstName &&
            `${reservationData?.user?.firstName} ${reservationData?.user?.lastName}`,

          bookingNo: reservationData.number,
          guestName: `${reservationData.guestDetails.primaryGuest.firstName} ${reservationData.guestDetails.primaryGuest.lastName}`,
          checkIn: getFormattedDate(reservationData.stayDetails.arrivalTime),
          checkOut: getFormattedDate(reservationData.stayDetails.departureTime),
          nights: reservationData.nightCount,
          roomCharge: reservationData.reservationItemsPayment.totalRoomCharge,
          tax:
            reservationData.reservationItemsPayment.totalCgstTax +
            reservationData.reservationItemsPayment.totalSgstTax,
          otherCharges:
            reservationData.reservationItemsPayment.totalAddOnsAmount,
          totalCharge: totalCharge,
          amountPaid: reservationData.paymentSummary.paidAmount,
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
    value &&
      value.forEach((data) => {
        this.records.push({
          id: data.id,
          bookingNo: data.number,
          guestName: `${data.guestDetails.primaryGuest.firstName} ${data.guestDetails.primaryGuest.lastName}`,
          roomType: data.stayDetails.room.type,
          roomNo: data.stayDetails.room.roomNumber,
          checkIn: getFormattedDate(data.stayDetails.arrivalTime),
          checkOut: getFormattedDate(data.stayDetails.departureTime),
          nights: data.nightCount,
          roomRent: data.reservationItemsPayment.totalRoomCharge,

          adr: data.nightCount
            ? data.reservationItemsPayment.totalRoomCharge / data.nightCount
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

    value &&
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
    this.records =
      value &&
      value.map((data) => {
        return {
          id: data.id,
          businessSource: data?.source,
          marketSegment: data?.marketSegment, //to be added in response
          phoneNumber:
            data?.guestDetails?.primaryGuest?.contactDetails?.contactNumber,
          email: data.guestDetails.primaryGuest.contactDetails.emailId,
          roomType: data.stayDetails.room.type,
          room: data.stayDetails.room.roomNumber,
          createdOn: getFormattedDate(data.created),
          checkIn: getFormattedDate(data.stayDetails.arrivalTime),
          checkOut: getFormattedDate(data.stayDetails.departureTime),

          lodging: data.reservationItemsPayment.totalRoomCharge,

          lodgingTax:
            data.reservationItemsPayment.totalCgstTax +
            data.reservationItemsPayment.totalSgstTax,

          otherCharges: data.reservationItemsPayment.totalAddOnsAmount,

          otherChargesTax: data.reservationItemsPayment.totalAddOnsTax,

          avgRoomRate:
            data.reservationItemsPayment.totalRoomCharge / data.nightCount ??
            data?.reservationItemsPayment?.totalRoomCharge,

          paidAndRevenueLoss: data?.paymentSummary?.paidAmount,

          balance: data?.paymentSummary?.dueAmount,
        };
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
    value &&
      value.forEach((data) => {
        this.records.push({
          roomNo: data?.roomNumber,
          roomType: data?.roomTypeName,
          bookingNo: data?.reservationNumber,
          guestName: data?.guestName,
          checkIn: data.arrivalDate,
          checkOut: data?.departureDate,
          nights: data?.nights,
          roomNotes: data?.remarks,
          status: data?.status,
        });
      });
    return this;
  }
}

//expressCheckIn
export class ExpressCheckIn
  implements ReportClass<ExpressCheckInData, ExpressCheckInResponse[]> {
  records: ExpressCheckInData[];
  deserialize(value: ExpressCheckInResponse[]): this {
    this.records = new Array<ExpressCheckInData>();
    value &&
      value.forEach((data) => {
        this.records.push({
          bookingNo: data?.number,
          guestName: `${data.guestDetails.primaryGuest.firstName} ${data.guestDetails.primaryGuest.lastName}`,
          roomType: `${data?.stayDetails?.room?.roomNumber} - ${data?.stayDetails?.room?.type}`,
          checkIn: getFormattedDate(data?.stayDetails?.arrivalTime),
          checkOut: getFormattedDate(data?.stayDetails?.departureTime),
          bookingAmount: toCurrency(data?.paymentSummary?.totalAmount),
          status: data?.pmsStatus,
        });
      });
    return this;
  }
}

//addOnRequestReport
export class AddOnRequestReport
  implements ReportClass<AddOnRequestReportData, AddOnRequestReportResponse[]> {
  records: AddOnRequestReportData[];
  deserialize(value: AddOnRequestReportResponse[]): this {
    this.records =
      value &&
      value.map((data) => {
        return {
          packageName: data?.packageName,
          packageCode: data?.packageCode,
          source: data?.source,
          amount: toCurrency(data?.rate),
          category: data?.category,
          active: data?.active,
          bookingNo: data?.reservationNumber,
        };
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

export function getFormattedDateWithTime(time: number) {
  const currentDate = new Date(time);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
  const date = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
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

import {
  DraftReservationReportResponse,
  ReservationResponse,
  ReservationResponseData,
} from 'libs/admin/shared/src/lib/types/response';
import {
  getFullName,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { ReportClass } from '../types/reports.types';
import {
  AddOnRequestReportData,
  AddOnRequestReportResponse,
  ArrivalReportData,
  CancellationReportData,
  CancellationReportResponse,
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
import {
  getFormattedDate,
  getFormattedDateWithTime,
} from '@hospitality-bot/admin/shared';

/**
 * @class Default Reservation Report class
 * Will be extended in every reservation report
 */
class ReservationReport {
  defaultValue: ReservationReportData;
  getDefaultValues(reservationData: ReservationResponseData) {
    this.defaultValue = {
      reservationId: reservationData.id,
      amountPaid: reservationData.totalPaidAmount,
      balance: reservationData.totalDueAmount,
      bookingAmount: reservationData.paymentSummary?.totalAmount,
      bookingNo: reservationData.number,
      guestName: getFullName(
        reservationData?.guestDetails?.primaryGuest.firstName,
        reservationData?.guestDetails?.primaryGuest.lastName
      ),
      otherCharges: null,
    };

    return this.defaultValue;
  }
}

export class NoShows {
  reservationId?: string;
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
  deserialize(value: ReservationResponseData) {
    // debugger;
    this.reservationId = value?.number;
    this.bookingNumber = value?.number;
    this.dateOfArrival = getFormattedDate(value?.arrivalTime);
    this.noShowOn = getFormattedDate(value?.updated);
    (this.guestName = getFullName(
      value?.guestDetails?.primaryGuest?.firstName,
      value?.guestDetails?.primaryGuest?.lastName
    )),
      (this.bookingAmount = toCurrency(value?.paymentSummary?.totalAmount));
    this.noShowCharge = null;
    this.noShowReason = value?.remarks?.length ? value?.remarks : null;
    this.otherCharge = null;
    this.amountPaid = toCurrency(value?.paymentSummary?.paidAmount);
    this.balance = toCurrency(value?.paymentSummary?.dueAmount);
    return this;
  }
}

export class NoShowReport extends ReservationReport
  implements ReportClass<NoShowReportData, ReservationResponse> {
  records: NoShowReportData[];

  deserialize(value: ReservationResponseData[]) {
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
  night: number;
  cancelledOn: string;
  cancellationCharge: string;
  cancellationReason: string;
  IDeserialize(value: CancellationReportResponse): this {
    this.reservationId = value?.id;
    this.bookingNumber = value?.number;
    const guestDetails = value?.guestDetails?.primaryGuest;
    this.guestName = getFullName(
      guestDetails?.firstName,
      guestDetails?.lastName
    );
    this.roomType = `${value?.stayDetails?.room?.roomNumber ?? ' '} - ${
      value?.stayDetails?.room?.type ?? ''
    }`;

    this.checkIn = getFormattedDate(value?.arrivalTime);
    this.checkOut = getFormattedDate(value?.departureTime);
    this.night = value?.nightCount;
    this.cancelledOn = getFormattedDate(value?.updateOn);
    this.cancellationCharge = toCurrency(value?.paymentSummary?.paidAmount);
    this.cancellationReason = value?.remarks ? value?.remarks : undefined;
    this.bookingAmount = toCurrency(value?.paymentSummary.totalAmount);
    this.otherCharge = toCurrency(
      value?.reservationItemsPayment?.totalAddOnsAmount
    );
    this.amountPaid = toCurrency(value?.paymentSummary?.paidAmount);
    this.balance = toCurrency(value?.paymentSummary?.dueAmount);
    return this;
  }
}
export class CancellationReport extends ReservationReport
  implements ReportClass<CancellationReportData, CancellationReportResponse> {
  records: CancellationReportData[];
  deserialize(value: CancellationReportResponse[]) {
    this.records = new Array<CancellationReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Cancellation().IDeserialize(reservationData));
    });
    return this;
  }
}

export class Arrival {
  reservationId?: string;
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
    this.reservationId = input.id;
    (this.bookingAmount = input.paymentSummary.totalAmount),
      (this.bookingNo = input.number),
      (this.guestName = getFullName(
        input.guestDetails.primaryGuest.firstName,
        input.guestDetails.primaryGuest.lastName
      ));

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
          reservationId: reservationData.id,
          bookingNo: reservationData.reservationNumber,
          guestName: getFullName(
            reservationData?.guest?.firstName,
            reservationData.guest.lastName
          ),

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
          reservationData.reservationItemsPayment.totalAddOnsAmount +
          reservationData.reservationItemsPayment.totalCgstTax +
          reservationData.reservationItemsPayment.totalSgstTax;

        this.records.push({
          reservationId: reservationData.id,
          userName: getFullName(
            reservationData?.user?.firstName,
            reservationData?.user?.lastName
          ),

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
          reservationId: data.id,
          bookingNo: data.number,
          guestName: getFullName(
            data.guestDetails.primaryGuest.firstName,
            data.guestDetails.primaryGuest.lastName
          ),
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
        const totalCharge =
          data.reservationItemsPayment.totalAddOnsAmount +
          data.reservationItemsPayment.totalRoomCharge;
        this.records.push({
          reservationId: data.id,
          bookingNo: data.number,
          guestName: getFullName(
            data.guestDetails.primaryGuest.firstName,
            data.guestDetails.primaryGuest.lastName
          ),
          checkIn: getFormattedDate(data.stayDetails.arrivalTime),
          checkOut: getFormattedDate(data.stayDetails.departureTime),
          nights: data.nightCount,
          lodgingAndOtherCharges: totalCharge,

          taxTotal:
            data.reservationItemsPayment.totalCgstTax +
            data.reservationItemsPayment.totalSgstTax +
            totalCharge,

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
          reservationId: data.id,
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
          reservationId: data?.id,
          bookingNo: data?.number,
          guestName: getFullName(
            data.guestDetails.primaryGuest.firstName,
            data.guestDetails.primaryGuest.lastName
          ),
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

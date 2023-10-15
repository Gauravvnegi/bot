import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import {
  ArrivalReportData,
  CancellationReportData,
  CashierReportData,
  DailyRevenueReportData,
  DepartureReportData,
  HistoryAndForecastReportData,
  ManagerFlashReportData,
  MonthlySummaryReportData,
  NoShowReportData,
} from '../../types/reportsData.type';
import { ReportClass } from '../../types/reports.type';

export class NoShowReport
  implements ReportClass<NoShowReportData, ReservationResponseData> {
  records: NoShowReportData[];

  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<NoShowReportData>();

    value.forEach((reservationData) => {
      this.records.push({
        bookingNo: reservationData.number,
        amountPaid: reservationData.totalPaidAmount,
        balance: reservationData.totalDueAmount,
        bookingAmount: reservationData.paymentSummary.totalAmount,
        dateOfArrival: reservationData.arrivalTime,
        guestName:
          reservationData.guestDetails.primaryGuest.firstName +
          reservationData.guestDetails.primaryGuest.lastName,
        dateOfNoShow: null,
        noShowCharges: null,
        noShowReason: '',
        otherCharges: null,
      });
    });

    return this;
  }
}

export class ArrivalReport
  implements ReportClass<ArrivalReportData, ReservationResponseData> {
  records: ArrivalReportData[];
  deserialize(value: ReservationResponseData[]) {
    return this;
  }
}

export class CancellationReport
  implements ReportClass<CancellationReportData, ReservationResponseData> {
  records: CancellationReportData[];
  deserialize(value: ReservationResponseData[]) {
    return this;
  }
}

export class DepartureReport
  implements ReportClass<DepartureReportData, ReservationResponseData> {
  records: DepartureReportData[];
  deserialize(value: ReservationResponseData[]) {
    return this;
  }
}

export class CashierReport
  implements ReportClass<CashierReportData, ReservationResponseData> {
  records: CashierReportData[];
  deserialize(value: any) {
    return this;
  }
}

export class DailyRevenueReport
  implements ReportClass<DailyRevenueReportData, ReservationResponseData> {
  records: DailyRevenueReportData[];
  deserialize(value: any) {
    return this;
  }
}

export class HistoryAndForecastReport
  implements
    ReportClass<HistoryAndForecastReportData, ReservationResponseData> {
  records: HistoryAndForecastReportData[];
  deserialize(value: any) {
    return this;
  }
}

export class ManagerFlashReport
  implements ReportClass<ManagerFlashReportData, ReservationResponseData> {
  records: ManagerFlashReportData[];
  deserialize(value: any) {
    return this;
  }
}

export class MonthlySummaryReport
  implements ReportClass<MonthlySummaryReportData, ReservationResponseData> {
  records: MonthlySummaryReportData[];
  deserialize(value: any) {
    return this;
  }
}

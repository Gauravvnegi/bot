import { formatDateToCustomString } from 'libs/web-user/shared/src/lib/utils/date-utils';
import { HistoryAndForecastReportResponse } from '../types/occupany-reports.types';
import { ReportClass } from '../types/reports.types';

export class HistoryAndForecastReportData {
  date: number | string;
  roomsOccupied: number;
  arrivalRooms: number;
  complimentaryRooms: number;
  occupancy: string;
  roomRevenue: string;
  revPAR: string;
  averageRate: string;
  departureRoom: number;
  dayUseRooms: number;
  noShow: number;
  cancelRooms: number;
  DNRRooms: number;
  houseUseRooms: number;
  pax: number;
  deserialize(input: HistoryAndForecastReportResponse) {
    const preciseNumber = (data: number) => {
      return +data.toFixed(2);
    };

    this.date = input?.subTotalObject
      ? 'SubTotal'
      : formatDateToCustomString(input?.date);
    this.roomsOccupied = input?.occupiedRooms;
    this.arrivalRooms = input?.arrivalRooms;
    this.complimentaryRooms = input?.complimentaryRooms;
    this.occupancy = `${preciseNumber(input?.occupancyPercentage) ?? 0} %`;
    this.roomRevenue = `Rs ${input?.roomRevenue}`;
    this.revPAR = `Rs ${preciseNumber(input?.revPar)}`;
    this.averageRate = `Rs ${preciseNumber(input?.averageRate)}`;
    this.departureRoom = input?.departureRooms;
    this.dayUseRooms = input?.dayUseRooms;
    this.noShow = input?.noShowRooms;
    this.cancelRooms = input?.cancelledReservationForToday;
    this.DNRRooms = input?.outOfServiceRooms;
    this.houseUseRooms = input?.houseUseRooms;
    this.pax = input?.inhouseAdults + input?.inhouseChildren;
    return this;
  }
}

export class HistoryAndForecastReport
  implements ReportClass<HistoryAndForecastReportData, any> {
  records: HistoryAndForecastReportData[];
  deserialize(values: HistoryAndForecastReportResponse[]) {
    this.records = new Array<HistoryAndForecastReportData>();
    if (!(values.length == 1 && values.find((item) => item?.subTotalObject))) {
      values.forEach((item) => {
        this.records.push(new HistoryAndForecastReportData().deserialize(item));
      });
    }
    return this;
  }
}

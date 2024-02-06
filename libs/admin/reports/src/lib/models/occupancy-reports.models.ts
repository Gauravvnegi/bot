import { formatDateToCustomString } from '@hospitality-bot/admin/shared';
import {
  HistoryAndForecastReportResponse,
  HouseCountReportData,
  HouseCountReportResponse,
} from '../types/occupany-reports.types';
import { ReportClass, RowStyles } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class HistoryAndForecastReportData extends RowStyles {
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
      ? 'Total'
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
    this.pax = input?.totalPersonInHouse;
    this.isSubTotal = input?.subTotalObject;
    return this;
  }
}

export class HistoryAndForecastReport
  implements ReportClass<HistoryAndForecastReportData, any> {
  records: HistoryAndForecastReportData[];
  deserialize(values: HistoryAndForecastReportResponse[]) {
    this.records = new Array<HistoryAndForecastReportData>();
    if (!(values.length == 1 && values.find((item) => item?.subTotalObject))) {
      values.forEach((item, index) => {
        this.records.push(new HistoryAndForecastReportData().deserialize(item));
      });
    }
    return this;
  }
}

export class HouseCountReport
  implements ReportClass<HouseCountReportData, HouseCountReportResponse[]> {
  records: HouseCountReportData[];

  deserialize(value: HouseCountReportResponse[]): this {
    this.records = new Array<HouseCountReportData>();

    this.records = value.map((item) => {
      return {
        date: getFormattedDate(item?.date),
        roomsAvailable: item?.availableRoom,
        roomsOccupied: item?.occupiedRooms,
        roomReserved: item?.roomNightsReserved,
        roomsSold: item?.arrivalRooms,
        total: item?.totalRooms,
        guestOccupied: item?.occupiedRoomGuests,
        guestReserved: item?.inhouseGuest,
        totalGuest: item?.totalPersonInHouse,
      };
    });

    return this;
  }
}

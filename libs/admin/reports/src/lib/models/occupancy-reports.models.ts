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
      const availableRoomPercentage = (
        (item?.availableRoom / item?.totalRooms) *
        100
      ).toFixed(2);
      const occupiedRoomPercentage = (
        (item?.occupiedRooms / item?.totalRooms) *
        100
      ).toFixed(2);
      const reservedRoomPercentage = (
        (item?.arrivalRooms / item?.totalRooms) *
        100
      ).toFixed(2);

      return {
        date: item?.subTotalObject ? 'Total' : getFormattedDate(item?.date),
        roomsAvailable: `${item?.availableRoom} (${availableRoomPercentage}%)`,
        roomsOccupied: `${item?.occupiedRooms} (${occupiedRoomPercentage}%)`,
        roomReserved: `${item?.arrivalRooms} (${reservedRoomPercentage}%)`,
        roomsSold: `${item?.arrivalRooms} (${reservedRoomPercentage}%)`,
        total: item?.totalRooms,
        guestOccupied: item?.occupiedRoomGuests,
        guestReserved: item?.arrivalPersons,
        totalGuest: item?.arrivalPersons,
        isSubTotal: item?.subTotalObject,
      };
    });

    return this;
  }
}

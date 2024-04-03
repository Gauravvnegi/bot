import {
  HistoryAndForecastColumns,
  HouseCountReportData,
} from '../types/occupany-reports.types';
import { ColsData } from '../types/reports.types';

export const historyAndForecastReportCols: ColsData<Omit<
  HistoryAndForecastColumns,
  'complimentaryRooms' | 'dayUseRooms' //in future it will be used
>> = {
  date: {
    header: 'Date',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  roomsOccupied: {
    header: `Rooms Occupied (ExclHouseUse)`,
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  arrivalRooms: {
    header: `Arr. Rooms`,
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  // complimentaryRooms: {
  //   header: `Comp. Rooms`,
  //   isSearchDisabled: true,
  //   isSortDisabled: true,
  // },
  occupancy: {
    header: 'Occ %',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  roomRevenue: {
    header: `Room Revenue`,
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  revPAR: {
    header: 'RevPAR',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  averageRate: {
    header: 'Average Rate',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  departureRoom: {
    header: 'Dep. Rooms',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  // dayUseRooms: {
  //   header: 'Day Use Rooms',
  //   isSearchDisabled: true,
  //   isSortDisabled: true,
  // },
  noShow: {
    header: 'No Show',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  cancelRooms: {
    header: 'Cncl Rooms',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  DNRRooms: {
    header: 'DNR Rooms',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  houseUseRooms: {
    header: 'House Use Rooms',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
};

// Currently no need
export const historyAndForecastReportRows = Object.keys(
  historyAndForecastReportCols
).map((key) => ({
  label: historyAndForecastReportCols[key].header,
  name: key,
}));

export const houseCountReportCols: ColsData<HouseCountReportData> = {
  date: {
    header: 'Date',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  roomsAvailable: {
    header: 'Rooms Available',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  roomsOccupied: {
    header: 'Rooms Occupied',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  roomReserved: {
    header: 'Rooms Reserved',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  roomsSold: {
    header: 'Rooms Sold',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  total: {
    header: 'Total Rooms',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  guestOccupied: {
    header: 'Guest Occupied',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  guestReserved: {
    header: 'Guest Reserved',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  totalGuest: {
    header: 'Total Guest',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
};

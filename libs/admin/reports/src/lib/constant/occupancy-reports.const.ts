import { HistoryAndForecastColumns } from '../types/occupany-reports.types';
import { ColsData } from '../types/reports.types';

export const historyAndForecastReportCols: ColsData<HistoryAndForecastColumns> = {
  date: {
    header: 'Date',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  roomsOccupied: {
    header: `Rooms Occupied (ExclHouseUse)`,
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  arrivalRooms: {
    header: `Arr. Rooms`,
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  complimentaryRooms: {
    header: `Comp. Rooms`,
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  occupancy: {
    header: 'Occ %',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  roomRevenue: {
    header: `Room Revenue`,
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  revPAR: {
    header: 'RevPAR',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  averageRate: {
    header: 'Average Rate',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  departureRoom: {
    header: 'Dep. Rooms',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  dayUseRooms: {
    header: 'Day Use Rooms',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  noShow: {
    header: 'No Show',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  cancelRooms: {
    header: 'Cncl Rooms',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  DNRRooms: {
    header: 'DNR Rooms',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  houseUseRooms: {
    header: 'House Use Rooms',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSearchDisabled: true,
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
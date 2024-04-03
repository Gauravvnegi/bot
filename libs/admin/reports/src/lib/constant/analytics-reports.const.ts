import {
  BusinessAnalysisReportData,
  CompanyContributionsReportData,
  MarketSegmentReportData,
  NoShowSummaryReportData,
  OccupancyAnalysisReportData,
} from '../types/analytics-reports.types';
import { ColsData } from '../types/reports.types';

export const companyContributionsReportCols: ColsData<CompanyContributionsReportData> = {};

export const noShowSummaryReportCols: ColsData<Omit<
  NoShowSummaryReportData,
  'reservationNumber' | 'guestId'
>> = {
  createdOn: {
    header: 'Created On',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingNo: {
    header: 'Booking No',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  rooms: {
    header: 'Rooms',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  company: {
    header: 'Company',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const occupancyAnalysisReportCols: ColsData<OccupancyAnalysisReportData> = {
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomAvailable: {
    header: 'Room Available',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  soldRooms: {
    header: 'Sold Rooms',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  soldRoomsPercent: {
    header: 'Sold Rooms %',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  singleSoldRooms: {
    header: 'Single Sold',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  doubleSoldRooms: {
    header: 'Double Sold',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  tripleSoldRooms: {
    header: 'Triple Sold',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  quadSoldRooms: {
    header: 'Quadpl. Sold',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  moreQuardplSoldRooms: {
    header: 'More Quadpl. Sold',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  revPar: {
    header: 'RevPAR',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const marketSegmentReportCols: ColsData<Omit<
  MarketSegmentReportData,
  'id'
>> = {
  marketSegment: {
    header: 'Market Segment',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  occupancy: {
    header: 'Occupancy %',
    isSortDisabled: true,
    isSearchDisabled: false,
  },

  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  revenue: {
    header: 'Revenue %',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const businessAnalysisReportCols: ColsData<BusinessAnalysisReportData> = {
  ...marketSegmentReportCols,
};

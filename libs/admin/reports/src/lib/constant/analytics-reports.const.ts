import {
  BusinessAnalysisReportData,
  CompanyContributionsReportData,
  MarketSegmentReportData,
  NoShowSummaryReportData,
  OccupancyAnalysisReportData,
} from '../types/analytics-reports.types';
import { ColsData } from '../types/reports.types';

export const companyContributionsReportCols: ColsData<CompanyContributionsReportData> = {};

export const noShowSummaryReportCols: ColsData<NoShowSummaryReportData> = {
  createdOn: {
    header: 'Created On',
    isSortDisabled: true,
  },
  bookingNo: {
    header: 'Booking No',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  rooms: {
    header: 'Rooms',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  company: {
    header: 'Company',
    isSortDisabled: true,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
  },
};

export const occupancyAnalysisReportCols: ColsData<OccupancyAnalysisReportData> = {
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  roomAvailable: {
    header: 'Room Available',
    isSortDisabled: true,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
  },
  soldRooms: {
    header: 'Sold Rooms',
    isSortDisabled: true,
  },
  soldRoomsPercent: {
    header: 'Sold Rooms %',
    isSortDisabled: true,
  },
  singleSoldRooms: {
    header: 'Single Sold',
    isSortDisabled: true,
  },
  doubleSoldRooms: {
    header: 'Double Sold',
    isSortDisabled: true,
  },
  tripleSoldRooms: {
    header: 'Triple Sold',
    isSortDisabled: true,
  },
  quadSoldRooms: {
    header: 'Quadpl. Sold',
    isSortDisabled: true,
  },
  moreQuardplSoldRooms: {
    header: 'More Quadpl. Sold',
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  revPar: {
    header: 'RevPAR',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const marketSegmentReportCols: ColsData<Omit<
  MarketSegmentReportData,
  'id'
>> = {
  marketSegment: {
    header: 'Market Segment',
    isSortDisabled: true,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  occupancy: {
    header: 'Occupancy %',
    isSortDisabled: true,
  },

  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  revenue: {
    header: 'Revenue %',
    isSortDisabled: true,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const businessAnalysisReportCols: ColsData<BusinessAnalysisReportData> = {
  ...marketSegmentReportCols,
};

import {
  BusinessAnalysisReportData,
  CompanyContributionsReportData,
  MarketSegmentReportData,
  NoShowSummaryReportData,
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
    header: 'Occupancy',
    isSortDisabled: true,
  },

  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
  },
  revenue: {
    header: 'Revenue',
    isSortDisabled: true,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
  },
};

export const marketSegmentReportRows = [
  { name: 'FIT', label: 'FIT' },
  { name: 'Corporate FIT', label: 'Corporate FIT' },
  { name: 'MICE', label: 'MICE' },
  { name: 'Budget', label: 'Budget' },
  { name: 'Aiosell BE', label: 'Aiosell BE' },
  { name: 'Sub Total', label: 'subTotal' },
];

export const businessAnalysisReportCols: ColsData<BusinessAnalysisReportData> = {
  ...marketSegmentReportCols,
};

export const businessAnalysisReportRows = [
  { name: 'AGENT', label: 'AGENT' },
  { name: 'OTA', label: 'OTA' },
  { name: 'OTHERS', label: 'OTHERS' },
  { name: 'WALK-IN', label: 'WALK_IN' },
  { name: 'Aiosell BE', label: 'Aiosell BE' },
  { name: 'Sub Total', label: 'subTotal' },
];
